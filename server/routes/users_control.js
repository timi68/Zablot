const {
  Friends,
  Settings,
  Activities,
  Users,
  FriendRequests,
  Notifications,
  Uploads,
  Quiz,
  Messages,
} = require("../models/index");
// const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const uuid = require("uuid");
const { ObjectId } = require("mongodb");
const async = require("async");
const { v4: uuidv4 } = uuid;
const { promisify } = require("util");
var crypto = require("../lib/crypto");
const isEmpty = require("lodash/isEmpty");
const { nanoid } = require("@reduxjs/toolkit");

/**
 * @param body {object}
 * @param federated {boolean}
 * @returns {Promise<{ success: boolean, sessionUser: {_id: string} }>}
 */
async function AddUser(body, federated) {
  try {
    let user = await Users.findOne(
      { Email: body.userEmail },
      { Provider: true }
    );
    if (user?._id) {
      if (federated && user?.Provider !== "zablot") {
        return {
          success: true,
          sessionUser: user,
        };
      }

      return { success: false, message: "User Already Exist By Email" };
    }

    const _id = new mongoose.Types.ObjectId();
    const hashedPassword = crypto.encrypt(body.userPassword);

    user = new Users({
      _id,
      FullName: body.fullName,
      UserName: body.userName,
      Email: body.userEmail,
      Password: hashedPassword,
      Image: {
        profile: body.picture ?? "",
        cover: "",
      },
      Sub: body.subject ?? nanoid(),
      Provider: body.provider ?? "zablot",
      Verified: body.verified ?? false,
      Gender: body.userGender ?? "",
      Online: false,
      Settings: _id,
      Friends: _id,
      Notifications: _id,
      FriendRequests: _id,
      Uploads: _id,
    });

    await user.save();
    const settings = new Settings({
      _id: user.Settings,
      user: user._id,
      settings: [],
    });

    await settings.save();
    const friends = new Friends({
      _id: user.Friends,
      user: user._id,
      friends: [],
    });

    await friends.save();
    const notifications = new Notifications({
      _id: user.Notifications,
      notifications: [],
    });

    await notifications.save(async (err, doc) => {
      await Notifications.findByIdAndUpdate(user.Notifications, {
        $push: {
          notifications: {
            Name: "Zablot",
            Title: "Welcoming message",
            Image: "",
            Description:
              "Welcome to zablot Timi James, Thanks for choosing us,We are glad to tell you that your account has been activated.  <i> You can click to view your profiles and  settings </i>.",
            Date: new Date(),
            Seen: false,
          },
        },
      });
    });

    const friendRequest = new FriendRequests({
      _id: user.FriendRequests,
      requests: [],
    });

    await friendRequest.save();
    const sessionUser = {
      _id,
    };

    return { success: true, sessionUser };
  } catch (error) {
    console.log({ error });
    return { success: false, error: error.message };
  }
}

const Login = async (req, res, next) => {
  try {
    if (isEmpty(req.body)) throw new Error("No data send");

    // const hashedPassword = hashPassword(req.body.userPassword);
    const user = await Users.findOne(
      {
        Email: req.body.userEmail,
      },
      {
        Password: 1,
        FullName: 1,
      }
    );

    let matched = crypto.compare(user.Password, req.body.userPassword);
    if (isEmpty(user) || !matched) {
      return res.json({
        success: false,
        message: "Email or password is incorrect",
      });
    }

    req.login({ _id: user._id }, function (err) {
      if (err) return next(err);
      res.json({
        success: true,
        message: `Authenticated as ${user.FullName}`,
      });
    });
  } catch (err) {
    console.log({ err });
    next(err);
  }
};

const checkUserName = (data, cb) => {
  const query = `select * = require() usersBase where username = "${data}"`;
  Users.query(query, (err, fields) => {
    if (!err) {
      console.log(fields);
      if (fields.length > 0) {
        cb({ not_allowed: "false" });
      } else {
        cb({ allowed: "true" });
      }
    } else {
      cb({ error: "there is error" });
    }
  });
};

const FetchUsers = async () => {
  try {
    const users = await Users.find({}, { FullName: 1, UserName: 1 });
    return { users };
  } catch (err) {
    console.log(err);
    return { Error: "There is error" };
  }
};

const Search = async (SearchText, callback) => {
  try {
    const searchString = SearchText.trim().replaceAll(" ", "|");

    const matched = await Users.find(
      {
        $or: [
          { FullName: new RegExp(searchString, "i") },
          { UserName: new RegExp(searchString, "i") },
        ],
      },
      { _id: 1, FullName: 1, UserName: 1 },
      { limit: 20, lean: true }
    );

    return callback({ matched });
  } catch (err) {
    console.log(err);
    callback({ error: err });
    return;
  }
};

const FetchUserDetails = async (id) => {
  try {
    const user = await Users.findById(mongoose.Types.ObjectId(id), {
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
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const fetchMessages = async (id, cb) => {
  try {
    const messages = await Messages.findById(id, { Message: 1 });
    cb(null, messages);
  } catch (error) {
    cb(error, null);
  }
};

const UploadQuiz = async (details, cb) => {
  try {
    const uploadQuiz = new Quiz({ _id: ObjectId(), ...details });
    await uploadQuiz.save();
    return { id: uploadQuiz._id };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

function hashPassword(/** @type {string} */ password) {
  const salt = crypto.randomBytes(16);
  return crypto.pbkdf2Sync(password, salt, 310000, 32, "sha256");
}

module.exports = {
  AddUser,
  FetchUserDetails,
  Search,
  FetchUsers,
  fetchMessages,
  UploadQuiz,
  Login,
};
