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
  process.nextTick(function () {
    cb(null, user);
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// Passport Google Signup Route

registerRouter.get(
  "/federated/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

registerRouter.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    failureRedirect: "/register",
    successReturnToOrRedirect: "/dashboard",
  })
);

registerRouter.post("/local", async function (req, res, next) {
  try {
    const body = req.body;
    console.log({ body });
    if (!body) return next({ error: "No data send" });

    const response = await AddUser(body);
    console.log({ response });

    if (response?.success) {
      return req.login(response.sessionUser, function (err) {
        if (err) return next(err);
        res.status(200).json(response);
      });
    }

    return res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = registerRouter;
