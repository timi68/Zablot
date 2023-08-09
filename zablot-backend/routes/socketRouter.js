const express = require("express");
const { ObjectId } = require("mongodb");
const { Socket } = require("socket.io");
const { Users, Activities, FriendRequests } = require("../models");
const router = express.Router();

router.post("/friend-request", async (req, res) => {
  try {
    const data = req.body;
    await Users.findByIdAndUpdate(data.Info.From, {
      $push: {
        PendingRequests: data.To,
      },
    }).exec();

    await FriendRequests.findOneAndUpdate(
      { _id: new ObjectId(data.To) },
      {
        $push: {
          requests: {
            ...data.Info,
            Date: new Date(),
          },
        },
      }
    ).exec();

    const act = await Activities.find({ UserId: new ObjectId(data.To) });
    /**
     * @type {Socket}
     */
    const socket = req.app.get("io");
    if (act?.length) {
      let x = 0;
      while (x < act.length) {
        socket.to(act[x].SocketId).emit("FRIENDSHIP_DEMAND", data.Info);
        x++;
      }
    }

    return res.json({ response: "done" });
  } catch (err) {
    console.log(err);
    return res.json({ Error: "there is error" });
  }
});

router.delete("/clean", async (req, res) => {
  try {
    /**
     * @type {{Id: string, _id: string}}
     */
    const data = req.body;
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
    res.send("done");
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
