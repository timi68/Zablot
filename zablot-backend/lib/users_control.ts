import * as models from "@models/index";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongodb";
import isEmpty from "lodash/isEmpty";
import { Request as Req, Response as Res, NextFunction as Next } from "express";

var crypto = require("../lib/crypto");

/**
 * @param body {object}
 * @param federated {boolean}
 * @returns {Promise<{ success: boolean, sessionUser: {_id: string} }>}
 */
export async function AddUser(body: any, federated = false) {
  try {
    let user = await models.Users.findOne(
      { email: body.userEmail },
      { Provider: true }
    );
    if (user?._id) {
      if (federated && user?.Provider !== "zablot") {
        return {
          success: true,
          sessionUser: user,
        };
      }

      return { success: false, message: "User Already Exist By email" };
    }

    const _id = new mongoose.Types.ObjectId();
    const hashedPassword = crypto.encrypt(body.userPassword);

    await models.Users.create({
      _id,
      firstName: body.firstName,
      lastName: body.lastName,
      userName: body.userName,
      email: body.userEmail,
      password: hashedPassword,
      image: {
        profile: body.picture ?? "",
        cover: "",
      },
      sub: body.subject ?? uuidv4(),
      provider: body.provider ?? "zablot",
      verified: body.verified ?? false,
      gender: body.userGender ?? "",
      online: false,
      settings: _id,
    });

    await models.Settings.create({
      _id: user.Settings,
      user: user._id,
      settings: [],
    });

    await models.Friends.create({
      _id: user.friends,
      user: user._id,
      friends: [],
    });

    await models.Notifications.create({
      _id: user.Notifications,
      notifications: [
        {
          name: "Zablot",
          title: "Welcoming message",
          image: "",
          description:
            "Welcome to zablot Timi James, Thanks for choosing us,We are glad to tell you that your account has been activated.  <i> You can click to view your profiles and  settings </i>.",
          Date: new Date(),
          Seen: false,
        },
      ],
    });

    await models.FriendRequests.create({
      _id: user.FriendRequests,
      requests: [],
    });

    const sessionUser = {
      _id,
    };

    return { success: true, sessionUser };
  } catch (error: any) {
    console.log({ error });
    return { success: false, error: error.message };
  }
}

export const Login = async (req: Req, res: Res, next: Next) => {
  try {
    if (isEmpty(req.body)) throw new Error("No data send");

    // const hashedPassword = hashPassword(req.body.userPassword);
    const user = await models.Users.findOne(
      {
        email: req.body.userEmail,
      },
      {
        Password: 1,
        firstName: 1,
      }
    );

    if (!user) {
    }

    let matched = crypto.compare(user.Password, req.body.userPassword);
    if (isEmpty(user) || !matched) {
      return res.json({
        success: false,
        message: "email or password is incorrect",
      });
    }

    res.json({
      success: true,
      message: `Authenticated as ${user.firstName}`,
    });
  } catch (err) {
    console.log({ err });
    next(err);
  }
};

// const checkUserName = (data, cb) => {
//   const query = `select * = require() usersBase where username = "${data}"`;
//   models.Users.query(query, (err, fields) => {
//     if (!err) {
//       console.log(fields);
//       if (fields.length > 0) {
//         cb({ not_allowed: "false" });
//       } else {
//         cb({ allowed: "true" });
//       }
//     } else {
//       cb({ error: "there is error" });
//     }
//   });
// };

export const FetchUsers = async () => {
  try {
    const users = await models.Users.find({}, { firstName: 1, userName: 1 });
    return { users };
  } catch (err) {
    console.log(err);
    return { Error: "There is error" };
  }
};

export const Search = async (
  SearchText: string,
  callback: (p: any) => void
) => {
  try {
    const searchString = SearchText.trim().replace(/\s/g, "|");

    const matched = await models.Users.find(
      {
        $or: [
          { firstName: new RegExp(searchString, "i") },
          { userName: new RegExp(searchString, "i") },
        ],
      },
      { _id: 1, firstName: 1, userName: 1 },
      { limit: 20, lean: true }
    );

    return callback({ matched });
  } catch (err) {
    console.log(err);
    callback({ error: err });
    return;
  }
};

export const FetchUserDetails = async (id: ObjectId) => {
  try {
    const user = await models.Users.findById(id, {
      All_Logins: 0,
      Online: 0,
      Last_Seen: 0,
      Account_Creation_Date: 0,
      DateOfBirth: 0,
    })
      .populate("FriendRequests")
      .populate("Notifications")
      .populate("Settings")
      .populate("Friends");

    return { success: true, user };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const fetchMessages = async (
  id: string,
  cb: (err: any, messages: { messages: Zablot.Message[] } | null) => void
) => {
  try {
    const messages = await models.Rooms.findById<{
      messages: Zablot.Message[];
    }>(id, { messages: 1 });

    cb(null, messages);
  } catch (error) {
    cb(error, null);
  }
};

export const UploadQuiz = async (details: object) => {
  try {
    const uploadQuiz = await models.Quiz.create(details);
    return { id: uploadQuiz._id };
  } catch (error: any) {
    console.log(error);
    return { error: error.message };
  }
};

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16);
  return crypto.pbkdf2Sync(password, salt, 310000, 32, "sha256");
}

// module.exports = {
//   AddUser,
//   FetchUserDetails,
//   Search,
//   FetchUsers,
//   fetchMessages,
//   UploadQuiz,
//   Login,
// };
