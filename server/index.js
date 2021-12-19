const dotenv = require("dotenv").config(),
	next = require("next"),
	express = require("express"),
	session = require("express-session"),
	{finished} = require("stream");
(flash = require("connect-flash")),
	(passport = require("passport")),
	(compressor = require("compression")),
	(cors = require("cors")),
	(connection = require("./connection/mongodb")),
	({router} = require("./routes")),
	({
		addUsers,
		calluser,
		checkUserName,
	} = require("./routes/users_control.js")),
	(ensureIsAuthenticated = require("./config/auth.js")),
	({activities: Act, users_auth: dbs} = require("./connection/mongodb.js")),
	(socket = require("socket.io")),
	(dev = process.env.NODE_ENV !== "production"),
	(client = next({dev})),
	(handle = client.getRequestHandler());

client
	.prepare()
	.then(() => {
		const app = express();

		app.use(express.urlencoded({extended: true}));
		app.use(express.json());
		app.use(cors());
		app.use(compressor());
		app.use("/uploads", express.static("uploads"));

		// setting external assests
		app.use(
			session({
				secret: "nothing jare",
				resave: false,
				saveUninitialized: true,
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

		app.get("/logout", async (req, res) => {
			req.logout();
			res.redirect("/login");
		});

		app.get("*", (req, res) => {
			req.session.name = {james: "oderinde"};
			return handle(req, res);
		});

		const server = app.listen(8000, () => {
			console.log("Listening on http://localhost:8000");
		});

		const io = socket(server);
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
