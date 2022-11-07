const express = require("express");
const loginRouter = require("./login");
const registerRouter = require("./register");
const authRouter = express.Router();

authRouter.use("/register", registerRouter);
authRouter.use("/login", loginRouter);
authRouter.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    req.logout(
      {
        keepSessionInfo: true,
      },
      () => {
        res.redirect("/");
      }
    );
  });
});

module.exports = authRouter;
