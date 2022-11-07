require("dotenv").config();

const csrf = require("csurf");
const logger = require("morgan");
const createError = require("http-errors");

const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const moment = require("moment");
const MongoStore = require("connect-mongo");

const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const compressor = require("compression");
const cors = require("cors");
const { router } = require("./routes/router");
const ensureIsAuthenticated = require("./config/auth.js");
const next = require("next");
const client = next({ dev: process.env.NODE_ENV !== "production" });
const handle = client.getRequestHandler();

// @ts-check

require("./connection/mongodb");
require("./cleanup").Cleanup();

process.stdin.resume();

const app = express();
const dev = process.env.NODE_ENV !== "production";

app.locals.pluralize = require("pluralize");

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.set("trust proxy", Number(!dev));
app.set("view engine", "ejs");

const sessionMiddleWare = session({
  cookie: {
    secure: !dev,
    expires: moment().add(30, "days").toDate(),
  },
  secret: process.env.CRYPTO_36,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    autoRemove: !dev ? "disabled" : undefined,
    touchAfter: 24 * 3600,
  }),
  crypto: {
    secret: process.env.CRYPTO_36,
  },
  saveUninitialized: false,
  resave: false,
});

const whitelist = ["http://localhost:3000", "https://zablot.herokuapp.com"];

const corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.includes(req.header("Origin"))) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) return false;
  // fallback to standard filter function
  return compressor.filter(req, res);
}

app.use(
  compressor({ brotli: { enabled: true, zlib: {} }, filter: shouldCompress })
);
// app.use(connectLiveReload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptionsDelegate));
app.use("/uploads", express.static(" "));
app.use(express.static("public"));
app.use(logger("dev"));
app.use(sessionMiddleWare);
app.use(passport.authenticate("session"));
app.use(flash());
// app.use(csrf());

app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.data = req.flash("data");
  res.locals.success = req.flash("success");
  next();
});

app.use(function (req, res, next) {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !!msgs.length;
  req.session.messages = [];
  next();
});

// app.use(function (req, res, next) {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

app.get("/", (req, res) => res.render("index"));
app.use("/api", router);
app.get("/login", (req, res) => res.render("signIn"));
app.get("/register", (req, res) => res.render("signUp"));
app.get("*", (req, res) => handle(req, res));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  console.log({ err });

  // render the error page
  res.status(err.status || 500);
  if (err.status === 404) {
    res.render("error");
  } else {
    res.json({ error: err.message, type: "Internal Server Error" });
  }
});

module.exports = { app, sessionMiddleWare, client };
