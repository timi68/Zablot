// @ts-check

const {
	Activities,
	Users,
	Friends,
	FriendRequests,
	Notifications,
	Messages,
} = require("../models");
const {ObjectId} = require("mongodb");
// const {promisify} = require("util")

function ControlSocketActions(socket) {
	socket.broadcast.emit("join", socket.id);
	socket.broadcast.emit("userjoined", "new user joined");
	socket.emit("userid", socket.id);

	socket.on("ACTIVEUSERS", async (callback) => {
		const users = await Activities.find({});
		const usersId = await users.map((user) => {
			return user.UserId.toString().slice(19, 24);
		});
		callback(usersId);
	});

	socket.on("ADD_JOINED_REQUEST", async (user, cb) => {
		try {
			const id = user.USERID;

			const new_user = new Activities({
				UserId: new ObjectId(id),
				SocketId: user.SOCKET_ID,
			});

			await new_user.save();
			await Users.findByIdAndUpdate(id, {
				Online: true,
			}).exec();
			socket.user = user;

			socket.broadcast.emit("STATUS", {
				_id: id,
				online: true,
			});
			cb(null, "done");
		} catch (error) {
			console.log(error);
			cb({error: "there is error"});
		}
	});

	socket.on("FRIEND_REQUEST", async (data, cb) => {
		console.log("Friends Request is called from server");
		try {
			await Users.findByIdAndUpdate(data.Info.From, {
				$push: {
					PendingRequests: data.To,
				},
			}).exec();

			await FriendRequests.findOneAndUpdate(
				{_id: new ObjectId(data.To)},
				{
					$push: {
						requests: {
							...data.Info,
							Date: new Date(),
						},
					},
				}
			).exec();

			const act = await Activities.find({UserId: data.To});
			if (act?.length) {
				let x = 0;
				while (x < act.length) {
					socket
						.to(act[x].SocketId)
						.emit("FRIENDSHIPDEMAND", data.Info);
					x++;
				}
			}

			return cb({response: "done"});
		} catch (err) {
			console.log(err);
			return cb({Error: "there is error"});
		}
	});

	socket.on("REJECT_REQUEST", async (data, cb) => {
		try {
			await Users.findByIdAndUpdate(data.GID, {
				$pull: {PendingRequests: data.CID},
			}).exec();

			await FriendRequests.findByIdAndUpdate(data.GID, {
				$pull: {
					requests: {
						From: data.GID,
					},
				},
			}).exec();

			async function ContinueReject() {
				const message = {
					title: "Friend request rejected",
					Name: "Zablot",
					Description: `<span class='assigned-name'> <b> ${data.CN} </b> </span> rejected your friendrequest `,
					Date: new Date(),
					Seen: false,
					Image: data.CI,
					Id: data.CID,
				};

				const active = await Activities.find({UserId: data.GID});
				if (active)
					await AddNotification(
						data.GID,
						message,
						true,
						active,
						socket
					);
				else await AddNotification(data.GID, message, false);
				return;
			}

			await ContinueReject();
			cb(null, "done");
		} catch (error) {
			console.log(error);
			return cb(error.message);
		}
	});

	socket.on("CANCELREQUEST", async ({from, to}, cb) => {
		try {
			await Users.findByIdAndUpdate(from, {
				$pull: {PendingRequests: to},
			}).exec();

			await FriendRequests.findByIdAndUpdate(to, {
				$pull: {requests: {From: from}},
			}).exec();

			const IsUserActive = await Activities.find({
				UserId: new ObjectId(to),
			});

			if (IsUserActive?.length > 0) {
				let x = 0;
				do {
					socket
						.to(IsUserActive.SocketId)
						.emit("REMOVEREQUEST", {from, to});
				} while (x < IsUserActive.length);
			}

			cb(null);
		} catch (err) {
			console.log(err);
			cb("Server error");
		}
	});

	// Socket that listen to Friend request acceptance:
	// Its get the coming id and the going id from the
	// the data and gives a callback of if there is any
	// error encountered or it is "done"

	socket.on("ACCEPT_REQUEST", async (data, cb) => {
		Users.findByIdAndUpdate(data.GID, {
			$pull: {PendingRequests: data.CID},
		}).exec();

		FriendRequests.findByIdAndUpdate(data.CID, {
			$pull: {
				requests: {
					From: data.GID,
				},
			},
		}).then(() => {
			ContinueAccept();
		});

		async function ContinueAccept() {
			const newMessage = new Messages({
				_id: new ObjectId(),
				From: new ObjectId(data.CID),
				To: new ObjectId(data.GID),
			});

			await newMessage.save();

			const friend_details = (type) => {
				let check = type === "c";
				return {
					friends: {
						_id: newMessage._id,
						Id: check ? data.CID : data.GID,
						Name: check ? data.CN : data.GN,
						Image: check ? data.CI : data.GI,
						UnseenMessages: 1,
						Last_Message: "You are now friends",
						IsPrivate: false,
					},
				};
			};

			Friends.findByIdAndUpdate(data.GID, {
				$push: friend_details("c"),
			}).exec();

			Friends.findByIdAndUpdate(data.CID, {
				$push: friend_details("g"),
			}).exec();

			const message = {
				title: "Friend request accepted",
				Name: "Zablot",
				Description: `<span class="assigned-name"> <b> ${data.CN} </b> </span> accepted your friend request `,
				Date: new Date(),
				Seen: false,
				Image: data.CI,
			};
			Activities.find({UserId: data.GID}, async (err, active) => {
				if (err) return cb("There is error");
				console.log(active);
				active != null
					? (socket.emit("NEWFRIEND", {
							_id: newMessage._id,
							Id: data.GID,
							Name: data.GN,
							active: true,
							Image: data.GI,
							UnseenMessages: 1,
							Last_Message: "You are now friends",
							IsPrivate: false,
					  }),
					  active.forEach(({SocketId}) => {
							socket.to(SocketId).emit("NEWFRIEND", {
								_id: newMessage._id,
								Id: data.CID,
								Name: data.CN,
								Image: data.CI,
								UnseenMessages: 1,
								active: true,
								Last_Message: "You are now friends",
								IsPrivate: false,
								IsComing: true,
							});
					  }),
					  await AddNotification(
							data.GID,
							message,
							true,
							active,
							socket
					  ))
					: socket.emit("NEWFRIEND", {
							_id: newMessage._id,
							Id: data.GID,
							Name: data.GN,
							Image: data.GI,
							active: false,
							UnseenMessages: 1,
							Last_Message: "You are now friends",
							IsPrivate: false,
					  }),
					await AddNotification(data.GID, message, false);
			});
		}

		return cb(null, "done");
	});

	socket.on("ANSWERED", async (data, callback) => {
		try {
			if (data.answer.index === data.picked.index) {
				if (data.coin) {
					const coin = parseInt(data.coin);
					await Users.findByIdAndUpdate(data.from, {
						$inc: {Coins: coin},
					}).exec();

					await Users.findByIdAndUpdate(data.to, {
						$inc: {Coins: -coin},
					}).exec();
				}
			}

			await Messages.findOneAndUpdate(
				{
					_id: new ObjectId(data.id),
					"Message._id": data.messageId,
				},
				{"Message.$.answered": data.picked}
			).exec();

			const active = await Activities.find({UserId: data.to});
			active.forEach(({SocketId}) => {
				socket.to(SocketId).emit("ANSWERED", data);
			});

			callback(null, "Done");
		} catch (err) {
			console.log(err);
			callback({Error: "Internal server error"});
		}
	});

	socket.on("no_answer_checked", (/** @type {any} */ user_id) => {
		Activities.find((err, user) => {
			if (err) return;

			console.log(user, "This is user message");
			const d = JSON.parse(JSON.stringify(user[0].USERS));
			let fil = d.filter((s) => s.user.id === user_id);

			socket
				.to(fil[0].user.socketId)
				.emit("incoming_message", {name: "james"});
		});
		socket.to();
	});

	socket.on("OUTGOINGFORM", async (data, callback) => {
		try {
			const formId = new ObjectId();

			Messages.findByIdAndUpdate(data._id, {
				$push: {
					Message: {
						_id: formId,
						Format: data.type,
						question: data.question,
						options: data.options,
						challenge: data.C,
						coin: data.coin,
						timer: data.timer,
						answered: {index: null},
						date: new Date(),
						seen: false,
						going: data.to,
						coming: data.from,
					},
				},
			}).exec();

			const soc = await Activities.find({UserId: data.to}, {SocketId: 1});
			data.date = new Date();
			data._id = formId;

			soc.forEach((user, i) => {
				socket.to(user.SocketId).emit("INCOMINGFORM", data);
			});

			return callback(null, {formId});
		} catch (error) {
			console.log(error);
			return callback("Error sending form message", null);
		}
	});

	socket.on("OUTGOINGMESSAGE", async (data, cb) => {
		try {
			// var existed = await Messages.findById(data._id);

			// const newMessage = new Messages({
			// 	_id: new ObjectId(),
			// 	From: new ObjectId(data.from),
			// 	To: new ObjectId(data.to),
			// });

			// if (!existed?._id) {
			// 	console.log("existed not");
			// 	await newMessage.save();
			// }
			const messageId = new ObjectId();
			socket.emit("OUTGOINGMESSAGE", {
				to: data.to,
				message: data.message,
			});

			Messages.findByIdAndUpdate(data._id, {
				$push: {
					Message: {
						_id: messageId,
						Format: data.type,
						message: data?.message,
						date: new Date(),
						filename: data?.filename,
						url: data?.url,
						seen: false,
						going: data.to,
						coming: data.from,
					},
				},
			}).exec();

			const soc = await Activities.find({UserId: data.to});
			data.date = new Date();
			data.messageId = messageId;

			if (soc?.length > 0) {
				Friends.updateMany(
					{
						_id: {$in: [data.from, data.to]},
						"friends._id": new ObjectId(data._id),
					},
					{
						$set: {
							"friends.$.Last_Message": data.message,
							"friends.$.LastPersonToSendMessage": new ObjectId(
								data.from
							),
						},
					}
				).exec();
				soc.forEach((user, i) => {
					socket.to(user.SocketId).emit("INCOMINGMESSAGE", data);
				});
			} else {
				Friends.updateMany(
					{
						_id: {$in: [data.from, data.to]},
						"friends._id": new ObjectId(data._id),
					},
					{
						$set: {
							"friends.$.Last_Message": data.message,
						},
						$inc: {
							"friends.$.UnseenMessages": 1,
						},
					}
				).exec();
			}

			if (soc?.length && data.type !== "plain")
				return cb("The user is active");
			cb(null, {messageId});
		} catch (err) {
			console.log(err);
			cb(err, null);
		}
	});

	socket.on("CLEANSEEN", async (data, callback) => {
		try {
			await Friends.findOneAndUpdate(
				{
					_id: new ObjectId(data._id),
					"friends._id": new ObjectId(data.Id),
				},
				{
					$set: {
						"friends.$.UnseenMessages": 0,
					},
				}
			).exec();
			callback(null, "Cleaned seen messages");
		} catch (err) {
			callback("There iss error", null);
		}
	});

	socket.on("disconnect", (user) => {
		Activities.findOneAndDelete({SocketId: socket.id}, async (err) => {
			if (!err) {
				console.log("One user is Disconnected ===>", socket.user);
				await Users.findByIdAndUpdate(socket?.user?.USERID || null, {
					Online: false,
					Last_Seen: new Date(),
				}).exec();
				socket.broadcast.emit("STATUS", {
					_id: socket?.user?.USERID || null,
					online: false,
					Last_Seen: new Date(),
				});
			}
		});
	});
}

async function AddNotification(id, message, emit, sid, socket) {
	Notifications.findByIdAndUpdate(
		id,
		{
			$push: {
				notifications: message,
			},
		},
		(err) => {
			console.log("this is ", emit);
			if (emit) {
				sid.forEach((active) => {
					socket.to(active.SocketId).emit("Notifications", message);
				});
				console.log("emitted to", sid);
			}
			console.log(err || "Error free from reject");
			return;
		}
	);
}

module.exports = ControlSocketActions;