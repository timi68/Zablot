// @ts-check

const {
  Activities,
  Users,
  Friends,
  FriendRequests,
  Notifications,
  Messages,
} = require("../models");
const { ObjectId } = require("mongodb");
const { promisify } = require("util");
const { Socket } = require("socket.io");

// FriendRequests.findByIdAndUpdate = promisify(FriendRequests.findByIdAndUpdate)
/**
 *
 * @param {Socket & {request: { session: {user: string}} }} socket
 */
function ControlSocketActions(socket) {
  socket.on(
    "ACTIVE_USERS",
    async (/** @type {(arg0: any) => void} */ callback) => {
      const users = await Activities.find({});
      const usersId = await users.map((user) => {
        return user.UserId.toString().slice(19, 24);
      });
      callback(usersId);
    }
  );

  socket.on("REJECT_REQUEST", async (data, cb) => {
    try {
      await Users.findByIdAndUpdate(data.going_id, {
        $pull: { PendingRequests: data.coming_id },
      }).exec();

      await FriendRequests.findByIdAndUpdate(data.coming_id, {
        $pull: {
          requests: {
            From: data.going_id,
          },
        },
      }).exec();

      async function ContinueReject() {
        const message = {
          title: "Friend request rejected",
          Name: "Zablot",
          Description: `<span class='assigned-name'> <b> ${data.coming_name} </b> </span> rejected your friendrequest `,
          Date: new Date(),
          Seen: false,
          Image: data.coming_image,
          Id: data.coming_id,
        };

        const active = await Activities.find({
          UserId: data.going_id,
        });

        AddNotification(
          data.going_id,
          message,
          Boolean(active?.length),
          active,
          socket
        );
        return;
      }

      await ContinueReject();
      cb(null, "done");
    } catch (error) {
      console.log(error);
      return cb(error.message);
    }
  });

  socket.on("CANCEL_REQUEST", async ({ from, to }, cb) => {
    try {
      await Users.findByIdAndUpdate(from, {
        $pull: { PendingRequests: to },
      }).exec();

      await FriendRequests.findByIdAndUpdate(to, {
        $pull: { requests: { From: from } },
      }).exec();

      const IsUserActive = await Activities.find({
        UserId: new ObjectId(to),
      });

      if (IsUserActive?.length > 0) {
        let x = 0;
        while (x < IsUserActive.length) {
          socket
            .to(IsUserActive[x].SocketId)
            .emit("REMOVE_REQUEST", { from, to });
          x++;
        }
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
    Users.findByIdAndUpdate(data.going_id, {
      $pull: { PendingRequests: data.coming_id },
    }).exec();

    await FriendRequests.findByIdAndUpdate(data.coming_id, {
      $pull: {
        requests: {
          From: data.going_id,
        },
      },
    }).exec();
    const newMessage = new Messages({
      _id: new ObjectId(),
      From: new ObjectId(data.coming_id),
      To: new ObjectId(data.going_id),
    });

    await newMessage.save();
    const friend_details = (/** @type {"c" | "g"} */ type) => {
      let check = type === "c";
      return {
        friends: {
          _id: newMessage._id,
          Id: check ? data.coming_id : data.going_id,
          Name: check ? data.coming_name : data.going_name,
          Image: check ? data.coming_image : data.going_image,
          UnseenMessages: 1,
          Last_Message: "You are now friends",
          IsPrivate: false,
        },
      };
    };

    await Friends.findByIdAndUpdate(data.going_id, {
      $push: friend_details("c"),
    }).exec();

    await Friends.findByIdAndUpdate(data.coming_id, {
      $push: friend_details("g"),
    }).exec();

    const message = {
      title: "Friend request accepted",
      Name: "Zablot",
      Description: `<span class="assigned-name"> <b> ${data.coming_name} </b> </span> accepted your friend request `,
      Date: new Date(),
      Seen: false,
      Image: data.coming_image,
      Id: data.coming_Id,
    };

    const FriendData = {
      _id: newMessage._id,
      Id: data.coming_id,
      Name: data.coming_name,
      Image: data.coming_image,
      UnseenMessages: 1,
      active: true,
      Last_Message: "You are now friends",
      IsPrivate: false,
      IsComing: true,
    };

    const active = await Activities.find({ UserId: data.going_id });

    if (active?.length) {
      let c = 0;

      while (c < active.length) {
        socket.to(active[c].SocketId).emit("NEW_FRIEND", FriendData);
        c++;
      }
    }

    AddNotification(
      data.going_id,
      message,
      Boolean(active?.length),
      active,
      socket
    );

    return cb(null, FriendData);
  });

  socket.on("ANSWERED", async (data, callback) => {
    try {
      if (data.OptionPicked.checked) {
        if (data.coin) {
          const coin = parseInt(data.coin);
          await Users.findByIdAndUpdate(data.coming, {
            $inc: { Coins: coin },
          }).exec();

          await Users.findByIdAndUpdate(data.going, {
            $inc: { Coins: -coin },
          }).exec();
        }
      }
    } catch (err) {
      console.log(err);
      callback({ Error: "Internal server error" });
    }
  });

  socket.on("NOANSWER", async (data, callback) => {
    try {
      if (data.coin) {
        const coin = parseInt(data.coin);
        await Users.findByIdAndUpdate(data.coming, {
          $inc: { Coins: coin },
        }).exec();

        await Users.findByIdAndUpdate(data.going, {
          $inc: { Coins: -coin },
        }).exec();
      }

      await Messages.findOneAndUpdate(
        {
          _id: new ObjectId(data.messagesId),
          "Message._id": data.messageId,
        },
        { "Message.$.noAnswer": true }
      ).exec();

      const active = await Activities.find({ UserId: data.going });
      active.forEach(({ SocketId }) => {
        socket.to(SocketId).emit("NOANSWER", data);
      });

      callback(null, "Done");
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on("OUTGOINGFORM", async (data, callback) => {
    try {
      const formId = new ObjectId();
      let date = new Date();
      Messages.findByIdAndUpdate(data._id, {
        $push: {
          Message: {
            ...data,
            _id: formId,
            date,
          },
        },
      }).exec();

      const isActive = await Activities.find(
        { UserId: data.going },
        { SocketId: 1 }
      );

      data.date = date;
      data._id = formId;

      if (isActive?.length) {
        isActive.forEach((user, i) => {
          socket.to(user.SocketId).emit("INCOMINGFORM", data);
        });
      }

      return callback(null, { formId, date });
    } catch (error) {
      console.log(error);
      return callback("Error sending form message", null);
    }
  });

  socket.on("OUTGOINGMESSAGE", async (message, cb) => {
    try {
      const messageId = new ObjectId();
      Messages.findByIdAndUpdate(message._id, {
        $push: {
          Message: {
            ...message,
            _id: messageId,
          },
        },
      }).exec();

      Friends.updateMany(
        {
          _id: { $in: [message.coming, message.going] },
          "friends._id": new ObjectId(message._id),
        },
        {
          $set: {
            "friends.$.Last_Message": message.message,
            "friends.$.LastPersonToSendMessage": new ObjectId(message.coming),
          },
          $inc: {
            "friends.$.UnseenMessages": 1,
          },
        }
      ).exec();

      const isActive = await Activities.find({ UserId: message.going });
      message._id = messageId;

      if (isActive?.length) {
        isActive.forEach((user) => {
          socket.to(user.SocketId).emit("INCOMINGMESSAGE", message);
        });
      }

      cb(null, { messageId });
    } catch (err) {
      console.log({ err });
      cb(err.message);
    }
  });

  socket.on("CLEAN_SEEN", async (data, callback) => {
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
      console.log({ err });
      callback("There is error", null);
    }
  });

  socket.on("disconnect", () => {
    Activities.findOneAndDelete({ SocketId: socket.id }, async (err) => {
      if (!err) {
        let user = socket.request.session.user ?? null;
        console.log("One user is Disconnected ===>", user);
        await Users.findByIdAndUpdate(user, {
          Online: false,
          Last_Seen: new Date(),
        }).exec();
        socket.broadcast.emit("STATUS", {
          _id: user,
          online: false,
          Last_Seen: new Date(),
        });
      }
    });
  });
}

/**
 *
 * @param {string} id
 * @param {object} message
 * @param {boolean} emit
 * @param {{SocketId: string}[]} sid
 * @param {Socket} socket
 * @returns
 */
async function AddNotification(id, message, emit, sid, socket) {
  try {
    var query = {
      $push: {
        notifications: message,
      },
    };
    await Notifications.findByIdAndUpdate(id, query).exec();

    if (emit) {
      let c = 0;
      while (c < sid.length) {
        socket.to(sid[c].SocketId).emit("Notifications", message);
        c++;
      }
    }
    return;
  } catch (err) {
    console.log(err);
    return;
  }
}

module.exports = ControlSocketActions;
