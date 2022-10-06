const dotenv = require("dotenv").config(),
  next = require("next"),
  express = require("express"),
  session = require("cookie-session"),
  { finished } = require("stream");
(flash = require("connect-flash")),
  (passport = require("passport")),
  (compressor = require("compression")),
  (cors = require("cors")),
  (connection = require("./connection/mongodb")),
  ({ router } = require("./routes")),
  ({
    addUsers,
    calluser,
    checkUserName,
  } = require("./routes/users_control.js")),
  (ensureIsAuthenticated = require("./config/auth.js")),
  ({ activities: Act, users_auth: dbs } = require("./connection/mongodb.js")),
  (socket = require("socket.io")),
  (dev = process.env.NODE_ENV !== "production"),
  (client = next({ dev })),
  (handle = client.getRequestHandler());

client
  .prepare()
  .then(() => {
    const app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors());
    app.use(compressor());
    app.use("/uploads", express.static(" "));
    app.use(express.static("public"));

    ///-momery unleaked---------
    app.set("trust proxy", 1);
    app.set("view engine", "ejs");

    app.use(
      session({
        cookie: {
          secure: true,
          maxAge: 24 * 30 * 60 * 60 * 1000,
        },
        secret: "zablot#",
        saveUninitialized: true,
        resave: false,
      })
    );

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    app.use((req, res, next) => {
      res.locals.error = req.flash("error");
      res.locals.data = req.flash("data");
      res.locals.success = req.flash("success");
      next();
    });

    app.use((req, res, next) => {
      next();
    });

    app.use("/api", router);

    app.get("/login", (req, res, next) => {
      return res.render("home/sign_in");
    });

    app.get("/register", (req, res, next) => {
      return res.render("home/sign_up");
    });

    app.get("/", (req, res, next) => {
      return res.render("home/index");
    });

    app.get("/logout", async (req, res) => {
      req.session = null;
      req.logout();
      res.send("Done");
    });

    app.get("*", (req, res) => {
      req.session.name = { james: "oderinde" };
      return handle(req, res);
    });

    const server = app.listen(process.env.PORT || 8000, () => {
      console.log("Listening on http://localhost:8000");
    });

    const io = socket(server, { pingTimeout: 1000, pingInterval: 1000 });
    io.on("connection", (socket) => {
      console.log("is-connected");

      const Controller = require("./socket");
      Controller(socket);
    });
  })
  .catch((ex) => {
    console.log(ex.stack, "from stack");
    process.exit(1);
  });
