import { Friends, Notifications, Settings, Users } from "@models/index";
import { NextFunction as Next, Request as Req, Response as Res } from "express";
import _ from "lodash";
import * as crypto from "@lib/crypto";
import mongoose from "mongoose";
import * as token from "@lib/token";
import HttpError from "@lib/httpError";
import { STATUS } from "@lib/constants";
import { v4 as uuidV4 } from "uuid";
import resizeImage from "@lib/processImage";
import { Storage } from "@google-cloud/storage";
import { hashPassword } from "@lib/crypto";
import * as models from "@models/index";

const storage = new Storage({
  keyFilename: "./key.json",
});

export default class UserController {
  static async getUser(req: Req, res: Res, next: Next) {
    try {
      // @ts-ignore
      let { _id: user_id } = req.user;

      // get user from database
      const user = await Users.findById(
        user_id,
        { notifications: 0, __v: 0, updatedAt: 0, password: 0 },
        { populate: "settings" }
      ).lean();

      if (!user) throw new HttpError("User not found", STATUS.BAD_REQUEST);

      console.log({ user });

      return res.json({
        success: true,
        //@ts-ignore - get the first insertion in the populated field
        user, // : { ...user, settings: user.settings[0]?.settings },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Req, res: Res, next: Next) {
    try {
      const user_id = req.params.user_id as string;

      const user = await Users.findById(user_id).lean<Zablot.User>();
      return res.json({ success: true, user });
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req: Req, res: Res, next: Next) {
    try {
      let skip = +(req.params.skip || 0);
      let filter = req.body;

      const users = await Users.find(
        filter,
        { __v: 0, updatedAt: 0, password: 0, settings: 0, notifications: 0 },
        { limit: 50, skip }
      );

      return res.json({ users, success: true });
    } catch (error) {
      next(error);
    }
  }

  // create a database store for a new user
  static async addUser(req: Req, res: Res, next: Next) {
    try {
      const user = req.body;

      if (!user.email || !user.password)
        throw new HttpError("Incomplete body fields", STATUS.BAD_REQUEST);

      let dbUser = await Users.findOne({ email: user.email });

      if (dbUser) {
        throw new HttpError("User Already Exist", STATUS.FORBIDDEN);
      }

      const _id = new mongoose.Types.ObjectId();
      const hashedPassword = await crypto.hashPassword(user.password);

      // create user, user setting and user notifications
      await Users.create({
        ...user,
        _id,
        password: hashedPassword,
        settings: _id,
      });

      await Settings.create({ _id });
      await Friends.create({
        _id,
        user: user._id,
        friends: [],
      });

      await Notifications.create({
        _id,
        notifications: [
          {
            name: "Zablot",
            title: "Welcoming message",
            image: "",
            description:
              "Welcome to zablot Timi James, Thanks for choosing us,We are glad to tell you that your account has been activated.  <i> You can click to view your profiles and  settings </i>.",
            seen: false,
          },
        ],
      });

      let accessToken = token.create(
        {
          _id,
          email: user.email,
        },
        "1h"
      );

      // @ts-ignore
      req.session.token = token;
      req.session.save((err) => {
        res.cookie("sid", crypto.encrypt(accessToken), { secure: false });
        return res.status(STATUS.CREATED).json({
          success: true,
          message: "User Registered Successfully",
          token: accessToken,
        });
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * sign user
   */
  static async signUser(req: Req, res: Res, next: Next) {
    try {
      const body = req.body;

      if (!body?.email || !body?.password)
        throw new HttpError("Incomplete body fields", STATUS.BAD_REQUEST);

      const user = await Users.findOne(
        {
          email: req.body.email,
        },
        { notifications: 0, __v: 0, updatedAt: 0 },
        { populate: "settings" }
      )
        /**
         * use lean to convert db object to plain object
         */
        .lean<Zablot.User>();

      if (!user) throw new HttpError("User doesn't exist", STATUS.NOT_FOUND);

      let matched = await crypto.verifyPassword(
        req.body.password,
        user!.password
      );

      if (_.isEmpty(user) || !matched) {
        throw new HttpError(
          "email or password is incorrect",
          STATUS.BAD_REQUEST
        );
      }

      return res.json({
        success: true,
        message: `Authenticated as ${user.email}`,
        user: {
          ..._.omit(user, ["password"]),
          // @ts-ignore
          settings: user.settings[0].settings,
        },
        token: token.create(_.pick(user, ["_id", "email", "firstName"]), "1h"),
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update user fields by email. email field should be provided in the req body and also the fields to update
   * The client field in the request body is a field that include additional response body fields
   */
  static async updateUser(req: Req, res: Res, next: Next) {
    try {
      const fields = req.body;
      const { _id } = req.user;

      //@ts-ignore - avoid updating user password using the endpoint
      if (fields.password || (fields.email && !req.authorized)) {
        throw new HttpError(
          "You are trying to update user password with wrong api. Please make use of the /api/auth/request-password-change api",
          STATUS.BAD_REQUEST
        );
      }

      await Users.findByIdAndUpdate(_id, fields);

      let client = res.locals.client as object;
      if (client) delete res.locals.client;

      res.json({
        success: true,
        message: "User Profile Updated Successfully.",
        ...client,
      });
    } catch (error: any) {
      return next(error);
    }
  }

  static async deleteUser(req: Req, res: Res, next: Next) {
    try {
      const { _id } = req.user;

      await Users.findByIdAndUpdate(_id, { deactivated: true });

      return res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  static async addImage(req: Req, res: Res, next: Next) {
    try {
      const file = req.file;
      const user = req.user;

      if (!file) {
        throw new HttpError(
          "Incomplete fields. Make sure a file is attached to the request.",
          STATUS.BAD_REQUEST
        );
      }

      // get google storage bucket
      const bucket = storage.bucket(process.env.BUCKET_NAME as string);

      // save image with user email to avoid duplication, when user change image it will replace the one that already exist
      const destinationFileName = `$users_images/` + user._id + ".jpg";

      const cloudFile = bucket.file(destinationFileName);

      // create a stream for user image to google storage bucket
      const stream = cloudFile.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
        resumable: false,
      });

      // catch stream error
      stream.on("error", (err) => next(err));

      // listen to finish event of stream
      stream.on("finish", async () => {
        try {
          // Making file public to the internet
          await cloudFile.makePublic();
          const publicUrl = cloudFile.publicUrl();

          await Users.findByIdAndUpdate(user._id, {
            image: { profile: publicUrl },
          });

          res.json({
            success: true,
            message: "User Profile image Successfully.",
            imageUrl: publicUrl,
          });
        } catch (error) {
          next(error);
        }
      });

      // resize image before to reduce size before streaming start
      stream.end(await resizeImage(file));
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Req, res: Res, next: Next) {
    try {
      let { password } = req.body;
      const { _id } = req.user;

      if (!password)
        throw new HttpError("Incomplete Fields", STATUS.BAD_REQUEST);

      // hash password before saving to database
      password = await hashPassword(password);

      await Users.findByIdAndUpdate(_id, { password });

      return res.json({
        success: true,
        message: "Password Updated Successfully.",
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async search(req: Req, res: Res, next: Next) {
    try {
      // get query requirements from body or req queries
      const {
        filter = {},
        searchBy = req.query.searchBy,
        searchText = req.query.s as string,
      } = req.body as {
        filter?: object;
        searchBy?: string;
        searchText: string;
      };

      // get model based on the caller of the route

      if (!searchText) {
        throw new HttpError("Incomplete Fields", STATUS.BAD_REQUEST);
      }

      // search by name (firstName and lastName)
      let nameSearch = [
        { firstName: { $regex: searchText } },
        { lastName: { $regex: searchText } },
      ];

      // search by phone number
      let phoneNumberSearch = {
        phoneNumber: { $regex: searchText },
      };

      // search by email
      let emailSearch = { email: { $regex: searchText } };

      // let assign the default to search all fields then modify letter
      // if user wants to search based on a specific field
      let searchParams: mongoose.FilterQuery<any>[] = [
        nameSearch,
        phoneNumberSearch,
        emailSearch,
      ].flat();

      if (searchBy) {
        switch (searchBy) {
          case "name":
            searchParams = nameSearch;
            break;
          case "phone":
            searchParams = [phoneNumberSearch];
            break;
          case "email":
            searchParams = [emailSearch];
            break;
        }
      }

      let projection = {
        firstName: 1,
        lastName: 1,
        phoneNumber: 1,
        email: 1,
        online: 1,
        createdAt: 1,
      };

      // tell if id is searchable
      const isValidId = mongoose.isValidObjectId(searchText);

      const users = await Users.find(
        {
          $or: isValidId
            ? [{ _id: searchText }, searchParams].flat()
            : searchParams,
          ...filter,
        },
        projection
      );

      return res.json({ success: true, matched: users });
    } catch (error) {
      next(error);
    }
  }
}
