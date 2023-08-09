const express = require("express");
const authRouter = express.Router();
const _ = require("lodash");
const { Login, AddUser } = require("../users_control");

require("./passport");
const passport = require("passport");

authRouter.post("/register", async function (req, res, next) {
  try {
    const body = req.body;
    if (!body) return next({ error: "No data send" });

    return res.status(200).json(await AddUser(body));
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Login authentication
authRouter.post("/login", Login);

// Google Authentication
authRouter.get("/federated/google", (req, res, next) => {
  // we need the referer url, so incase any error happened... we redirect to the url
  req.app.set("auth_referer", req.headers["referer"]);
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })(req, res, next);
});

authRouter.get("/oauth2/redirect/google", (req, res, next) => {
  passport.authenticate("google", {
    failureRedirect: req.app.get("auth_referer"),
    failureFlash: true,
    successRedirect: "/dashboard",
  })(req, res, next);
});

// Facebook Authentication

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import("express").NextFunction} next
 * @returns
 */
function ensureIsAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
    res.end();
  }
}

module.exports = authRouter;
