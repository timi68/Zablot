const express = require("express");
const router = express.Router();
const eventEmitter = require("events");
const emitter = new eventEmitter();
const {verify} = require("jsonwebtoken");

const {
	checkUser,
	addUsers,
	Search,
	FetchUsers,
	FetchUserDetails,
	CancelRequest,
	fetchMessages,
} = require("./users_control");
const ensureIsAuthenticated = require("../config/auth");

router.post("/users/login", async (req, res, next) => {
	const body = req.body;

	if (!body) return res.status(400).json({error: "No data send"});
	const process = await checkUser(req, body);

	return res.status(200).json(process);
});

router.post("/users/register", async (req, res) => {
	try {
		const body = req.body;
		console.log(body);
		if (!body) return res.status(400).json({error: "No data send"});

		const response = await addUsers(body);

		if (response?.success) {
			req.flash("success", "You have been registered successfully");
		} else {
			console.log(response);
		}
		return res.status(200).json(response);
	} catch (err) {
		res.status(500).json({Error: "Internal Server Error"});
	}
});

router.post("/find", async (req, res) => {
	try {
		Users.findById(req.body.id)
			.populate("Settings")
			.populate("Friends")
			.exec((err, user) => {
				if (!user ?? user === undefined)
					return res.status(200).json({user});

				return res.status(200).json({user});
			});
	} catch (e) {
		return res.status(200).json({e});
	}
});

router.post("/users", async (req, res) => {
	const {users, Error} = await FetchUsers();
	return res.json(users || Error);
});

router.post("/user/details", (req, res) => {
	const {id} = req.body;
	if (!id) return res.status(404).json({Response: "Not allowed"});

	FetchUserDetails(id, (user) => {
		user
			? res.status(200).json(user)
			: res.status(500).json({Error: "Not_found"});
	});

	return;
});

router.post("/search", (req, res) => {
	const {searchText} = req.body;

	Search(searchText, ({error, matched}) => {
		if (error) return res.status(400).json({error});
		res.status(200).json(matched);
		res.end();
	});
});

router.put("/cancel/request", (req, res) => {
	const {from, to} = req.body;
	if (!from || !to) return res.status(400).send("Bad request");

	CancelRequest(from, to, (err) => {
		if (err) return res.status(500).send("Server Error");
		res.status(200).send("done");
		res.end();
	});
});

router.post("/messages", (req, res) => {
	const {_id} = req.body;
	if (!_id) return res.status(400).send("Bad requests");

	fetchMessages(_id, (err, messages) => {
		if (!err) return res.status(200).json(messages);
		return res.status(400).json({err});
	});
});

module.exports = {router, emitter};
