var express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("it worked");
});

router.get("/login", (req, res) => {
  res.render("home/sign_in");
});

module.exports = router;
