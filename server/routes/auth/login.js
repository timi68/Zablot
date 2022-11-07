const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { Login } = require("../users_control");
const loginRouter = express.Router();
const verify = require("./verify");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      passReqToCallback: true,
      callbackURL: "/api/auth/login/oauth2/redirect/google",
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

loginRouter.get(
  "/federated/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

loginRouter.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successReturnToOrRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

loginRouter.post("/local", Login);

module.exports = loginRouter;
