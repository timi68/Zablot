import express, {
  Request as Req,
  Response as Res,
  NextFunction as Next,
} from "express";
import _ from "lodash";
import { Login, AddUser } from "@lib/users_control";
import passport from "passport";
import googleVerify from "@lib/googleVerify";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import UserController from "@lib/controllers/userController";
import { create } from "@lib/token";

const authRouter = express.Router();

authRouter.post("/sign-up", UserController.addUser);
authRouter.post("/sign-in", UserController.signUser);

// Google Authentication
authRouter.get("/federated/google", (req, res, next) => {
  // we need the referer url, so incase any error happened... we redirect to the url
  req.app.set("auth_referer", req.headers["referer"]);
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })(req, res, next);
});

authRouter.get("/oauth2/redirect/google", (req, res, next) => {
  const callback: passport.AuthenticateCallback = (err, user) => {
    res.cookie("sid", create(user as Express.User, "2h"));
    res.redirect("http://localhost:3000");
  };

  passport.authenticate(
    "google",
    {
      failureRedirect: req.app.get("auth_referer"),
      failureFlash: true,
    },
    callback
  )(req, res, next);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"] as string,
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"] as string,
      passReqToCallback: true,
      callbackURL: "/auth/oauth2/redirect/google",
    },
    googleVerify
  )
);

// passport.serializeUser(function (
//   user: object,
//   cb: (err: Error | null, user: object) => void
// ) {
//   process.nextTick(function () {
//     cb(null, user);
//   });
// });

// passport.deserializeUser(function (
//   user: object,
//   cb: (err: Error | null, user: object) => void
// ) {
//   console.log({ user });
//   process.nextTick(function () {
//     return cb(null, user);
//   });
// });

export default authRouter;
