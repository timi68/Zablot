import logger from "morgan";
import createError from "http-errors";
import moment from "moment";
import MongoStore from "connect-mongo";

import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
// import flash from "connect-flash";
import passport from "passport";
import compressor from "compression";
import cors, { CorsOptions } from "cors";
import router from "./routes/router";
import HttpError from "@lib/httpError";
import { STATUS, serverErrors } from "@lib/constants";
import corsOptionsDelegate from "@lib/corsOptionsDelegate";

export const app = express();
const prod = process.env.NODE_ENV === "production";

// app.set("trust proxy", +prod);
app.set("view engine", "ejs");

export const sessionMiddleWare = session({
  name: "_s",
  cookie: {
    secure: prod,
    expires: moment().add(30, "days").toDate(),
  },
  secret: process.env.CRYPTO_PASSWORD as string,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    autoRemove: !prod ? "disabled" : undefined,
    touchAfter: 24 * 3600,
  }),
  saveUninitialized: false,
  resave: false,
});

function shouldCompress(req: Request, res: Response) {
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
// app.use(csrf());

// app.use(function (req, res, next) {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

app.use("/", router);
app.use("/api", router);
// app.get("/login", (req, res) => res.render("signIn"));
// app.get("/register", (req, res) => res.render("signUp"));
// app.get("/logout", async (req, res) => {
//   req.session.destroy(() => {
//     req.logout(() => res.redirect("/"));
//   });
// });

// not found
app.use((_req, _res, next) => {
  next(
    new HttpError(
      "The path you called doesn't exist, try checking the request method",
      STATUS.NOT_FOUND
    )
  );
});

// error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  // Check if the error has a specific HTTP status code
  const statusCode = err.statusCode || 500;

  if (statusCode === 500) console.error(err); // Log the error for debugging purposes

  // Set the response status code and send the error message
  return res.status(statusCode).json({
    name: serverErrors[statusCode],
    message: err.message ?? "Internal Server Error",
    statusCode,
  });
});

// module.exports = { app, sessionMiddleWare };
