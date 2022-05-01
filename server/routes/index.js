const express = require("express");
const router = express.Router();
const eventEmitter = require("events");
const emitter = new eventEmitter();
const { verify } = require("jsonwebtoken");
const formidable = require("formidable");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const { promisify } = require("util");
const Async = require("async");

const {
  FetchUser,
  AuthLogin,
  addUsers,
  Search,
  FetchUsers,
  FetchUserDetails,
  fetchMessages,
  UploadQuiz,
} = require("./users_control");
const ensureIsAuthenticated = require("../config/auth");
const path = require("path");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

router.post("/users/login", async (req, res, next) => {
  const body = req.body;

  if (!body) return res.status(400).json({ error: "No data send" });
  const isAuthenticated = await AuthLogin(req, body);

  return res.status(200).json(isAuthenticated);
});

router.post("/users/register", async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    if (!body) return res.status(400).json({ error: "No data send" });

    const response = await addUsers(body);

    if (response?.success)
      req.flash("success", "You have been registered successfully");
    return res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/find", async (req, res) => {
  try {
    Users.findById(req.body.id)
      .populate("Settings")
      .populate("Friends")
      .exec((err, user) => {
        if (!user ?? user === undefined) return res.status(200).json({ user });

        return res.status(200).json({ user });
      });
  } catch (e) {
    return res.status(200).json({ e });
  }
});

router.post("/user/details", async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ Response: "Not allowed" });

  var response = await FetchUserDetails(id);
  return res.json(response);
});

router.post("/search", (req, res) => {
  const { searchText } = req.body;

  Search(searchText, ({ error, matched }) => {
    if (error) return res.status(400).json({ error });
    res.status(200).json(matched);
    res.end();
  });
});

router.post("/messages", (req, res) => {
  const { _id } = req.body;
  if (!_id) return res.status(400).send("Bad requests");

  fetchMessages(_id, (err, messages) => {
    if (!err) return res.status(200).json(messages);
    return res.status(400).json({ err });
  });
});

router.post("/media/upload", (req, res) => {
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    let f = Object.values(files);

    if (f[0]?.length) f = f[0];

    async function cloud(n, cb) {
      try {
        // await cloudinary.uploader.upload(f[0][n].filepath, (result) => {
        // 	if (result?.public_id) return cb(null, result);
        // 	else return cb("Error");
        // });
        let file = f[n];
        fs.rename(
          file.filepath,
          path.resolve(
            __dirname + "/",
            "../../public/images/",
            "./" + file.originalFilename
          ),
          () => {
            var fileProp = {
              filename: file.originalFilename,
              url: "/images/" + file.originalFilename,
            };
            return cb(null, fileProp);
          }
        );
      } catch (err) {
        return;
      }
    }
    Async.times(
      f.length,
      function (n, next) {
        cloud(n, (err, result) => {
          if (err) return res.end("Connection lost");
          next(err, result);
        });
      },
      function (err, results) {
        if (err) return res.end("No connection");
        return res.json(results);
      }
    );
  });
});

router.post("/quiz/upload", async (req, res) => {
  const questionDetails = req.body;

  const upload = await UploadQuiz(questionDetails);
  console.log("after uploading quiz", upload);
  res.status(200).json(upload);
});

module.exports = { router, emitter };
