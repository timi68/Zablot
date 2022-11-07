const { Schema, model, models } = require("mongoose");

const UsersSchema = Schema(
  {
    FullName: {
      type: String,
      required: true,
    },
    UserName: String,
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: Buffer,
      required: true,
    },
    Sub: {
      type: String,
      default: null,
    },
    Provider: String,
    Gender: String,
    Settings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Settings",
      },
    ],
    Friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "Friends",
      },
    ],
    Notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notifications",
      },
    ],
    FriendRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "FriendRequests",
      },
    ],
    Uploads: [
      {
        type: Schema.Types.ObjectId,
        ref: "Uploads",
      },
    ],
    Image: {
      profile: String,
      cover: String,
    },
    PendingRequests: {
      type: Array,
      default: [],
    },
    Online: {
      type: Boolean,
      default: false,
    },
    Last_Seen: String,
    All_Logins: {
      type: Array,
      default: [],
    },
    Coins: {
      type: Number,
      default: 0,
    },
    Verified: {
      type: Boolean,
      default: false,
    },
    DateOfBirth: Date,
  },
  {
    collection: "Users",
    timestamps: true,
  }
);

const FriendsSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    friends: [
      {
        _id: Schema.Types.ObjectId,
        Id: Schema.Types.ObjectId,
        Name: String,
        Image: String,
        LastPersonToSendMessage: Schema.Types.ObjectId,
        UnseenMessages: Number,
        Last_Message: String,
        IsPrivate: Boolean,
        time: Number,
      },
    ],
  },
  {
    collection: "Friends",
  }
);

const SettingSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    user: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    settings: {
      type: Array,
      require: true,
    },
  },
  {
    collection: "Settings",
  }
);

const ActivitiesSchema = new Schema(
  {
    UserId: {
      type: String,
      required: true,
    },
    SocketId: {
      type: String,
      required: true,
    },
  },
  {
    collection: "Activities",
  }
);

const MessagesSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    From: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    To: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    Message: [
      {
        _id: Schema.Types.ObjectId,
        Format: String,
        message: String,
        url: String,
        going: String,
        coming: String,
        filename: String,
        question: String,
        options: Array,
        date: Date,
        noAnswer: Boolean,
        answered: {},
        coin: Number,
        timer: Number,
      },
    ],
    VoiceCall: [],
    VideoCall: [],
  },
  {
    collection: "Messages",
  }
);

const FriendRequestsSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    requests: [],
  },
  {
    collection: "FriendRequests",
  }
);

const NotificationSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    notifications: [],
  },
  {
    collection: "Notifications",
  }
);

const UploadsSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    Uploader: {
      name: String,
      image: String,
    },
    type: String,
    Url: String,
    Caption: String,
    Mentions_Tags: Array,
    Feedback: {
      Likes: Array,
      Comments: Array,
      Shares: Array,
    },
  },
  {
    collection: "Uploads",
    timestamps: true,
  }
);

const QuizSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true },
    quizName: String,
    closeTime: Date,
    openTime: Date,
    Purpose: String,
    Password: String,
    Questions: Array,
  },
  {
    collection: "Quiz",
    timestamps: true,
  }
);

const FederatedSchema = new Schema(
  {
    provider: String,
    subject: {
      required: true,
      type: String,
      unique: true,
    },
  },
  {
    collection: "FederatedCredentials",
    timestamps: true,
  }
);

const Users = models.Users || model("Users", UsersSchema);
const Activities = models.Activities || model("Activities", ActivitiesSchema);
const Settings = models.Settings || model("Settings", SettingSchema);
const Friends = models.Friends || model("Friends", FriendsSchema);
const Messages = models.Messages || model("Messages", MessagesSchema);
const Notifications =
  models.Notifications || model("Notifications", NotificationSchema);
const FriendRequests =
  models.FriendRequests || model("FriendRequests", FriendRequestsSchema);
const Uploads = models.Uploads || model("Uploads", UploadsSchema);
const Quiz = models.Quiz || model("Quiz", QuizSchema);
const FederatedCredentials =
  models.FederatedCredentials || model("FederatedCredentials", FederatedSchema);

module.exports = {
  Users,
  Activities,
  Settings,
  Friends,
  Messages,
  Notifications,
  FriendRequests,
  Uploads,
  Quiz,
  FederatedCredentials,
};
