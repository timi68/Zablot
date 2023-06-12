const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { AddUser } = require("../users_control");
const registerRouter = express.Router();
const verify = require("./verify");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      passReqToCallback: true,
      callbackURL: "/api/auth/register/oauth2/redirect/google",
    },
    verify
  )
);

passport.serializeUser(function (user, cb) {
  console.log({ user });
  process.nextTick(function () {
    cb(null, user);
  });
});

passport.deserializeUser(function (user, cb) {
  console.log({ user });
  process.nextTick(function () {
    return cb(null, user);
  });
});

// Passport Google Signup Route

registerRouter.get(
  "/federated/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    passReqToCallback: true,
  })
);

registerRouter.get("/oauth2/redirect/google", () => {
  passport.authenticate("google", (err, user, info) => {
    console.log({ err, user, info });
    res.send("done");
  })(req, res, next);
});

registerRouter.post("/local", async function (req, res, next) {
  try {
    const body = req.body;
    if (!body) return next({ error: "No data send" });

    return res.status(200).json(await AddUser(body));
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = registerRouter;
