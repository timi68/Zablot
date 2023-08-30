import express from "express";
import { ObjectId } from "mongodb";
import { Socket } from "socket.io";
import { Users, Activities, FriendRequests, Friends } from "@models/index";

const router = express.Router();

router.post("/friend-request", async (req, res) => {
  try {
    const data = req.body;
    await Users.findByIdAndUpdate(data.Info.from, {
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
    const data = req.body as { id: string; _id: string };
    await Friends.findOneAndUpdate(
      {
        _id: new ObjectId(data._id),
        "friends._id": new ObjectId(data.id),
      },
      {
        $set: {
          "friends.$.unseenMessages": 0,
        },
      }
    );

    res.send("done");
  } catch (error: any) {
    res.send(error.message);
  }
});

export default router;
