process.stdin.resume();

// @ts-check
require("dotenv").config();
require("./connection/mongodb");
require("./cleanup").Cleanup();
require("./types");

const { ObjectId } = require("mongodb");
const { Socket } = require("socket.io");
const { Activities, Users } = require("./models");
const next = require("next"),
  express = require("express"),
  session = require("express-session"),
  flash = require("connect-flash"),
  passport = require("passport"),
  compressor = require("compression"),
  cors = require("cors"),
  { router } = require("./routes"),
  ensureIsAuthenticated = require("./config/auth.js"),
  socket = require("socket.io"),
  dev = process.env.NODE_ENV !== "production",
  // @ts-ignore
  client = next({ dev }),
  handle = client.getRequestHandler();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(compressor());
app.use("/uploads", express.static(" "));
app.use(express.static("public"));

app.set("trust proxy", Number(!dev));
app.set("view engine", "ejs");

const sessionMiddleWare = session({
  cookie: {
    secure: !dev,
    maxAge: 24 * 30 * 60 * 60 * 1000,
  },
  secret: "zablot#",
  saveUninitialized: false,
  resave: false,
});

const wrap =
  (/** @type {any} */ middleware) =>
  (/** @type {socket.Socket & Request} */ socket, /** @type {Next} */ next) =>
    middleware(socket.request, {}, next);

const SocketSign = async (
  /** @type {socket.Socket & Request} */ socket,
  /** @type {Next} */ next
) => {
  const session = socket.request.session;
  if (session && session.user) {
    const new_user = new Activities({
      UserId: new ObjectId(session.user),
      SocketId: socket.id,
    });

    await new_user.save();
    await Users.findByIdAndUpdate(session.user, {
      Online: true,
    }).exec();

    socket.broadcast.emit("STATUS", {
      _id: session.user,
      online: true,
    });
    next();
  } else {
    next(new Error("unauthorized"));
  }
};

app.use(sessionMiddleWare);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.data = req.flash("data");
  res.locals.success = req.flash("success");
  next();
});

// @ts-ignore
app.use((req, res, next) => {
  next();
});

app.use("/api", router);

// @ts-ignore
app.get("/login", (req, res) => res.render("home/sign_in"));
app.get("/register", (req, res) => res.render("home/sign_up"));
app.get("/", (req, res) => res.render("home/index"));
app.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    req.logout(
      {
        keepSessionInfo: true,
      },
      () => {
        res.end("Done");
      }
    );
  });
});

app.get("*", (req, res) => handle(req, res));

client
  .prepare()
  .then(() => {
    const server = app.listen(process.env.PORT || 8000, () => {
      console.log(
        "Listening on http://localhost:" + (process.env.PORT ?? 8000)
      );
    });

    const io = socket(server, { pingTimeout: 30000, pingInterval: 30000 });

    // convert a connect middleware to a Socket.IO middleware
    io.use(wrap(sessionMiddleWare));
    // only allow authenticated users
    io.use(SocketSign);
    app.set("io", io);

    io.on("connection", (/** @type {import("./types").ModSocket} */ socket) => {
      require("./socket")(socket);
    });
  })
  .catch((/** @type {{ stack: any; }} */ ex) => {
    console.log(ex.stack, "from stack");
    process.exit(1);
  });
