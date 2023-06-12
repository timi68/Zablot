const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { Login } = require("../users_control");
const loginRouter = express.Router();
const verify = require("./verify");

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

loginRouter.post("/local", Login);

module.exports = loginRouter;
