import { model, models } from "mongoose";

// models
import userSchema from "@models/userModel";
import activitySchema from "@models/activityModel";
import settingSchema from "@models/settingModel";
import friendSchema from "./friendModel";
import notificationSchema from "./notificationModel";
import quizSchema from "./quizModel";
import uploadSchema from "./uploadModel";
import friendRequestSchema from "./friendRequestModel";
import roomSchema from "./roomModel";
import federatedSchema from "./federatedModel";

export const Users = models.Users || model("Users", userSchema);
export const Activities =
  models.Activities || model("Activities", activitySchema);
export const Settings = models.Settings || model("Settings", settingSchema);
export const Friends = models.Friends || model("Friends", friendSchema);
export const Rooms = models.Messages || model("Rooms", roomSchema);
export const Notifications =
  models.Notifications || model("Notifications", notificationSchema);
export const FriendRequests =
  models.FriendRequests || model("FriendRequests", friendRequestSchema);
export const Uploads = models.Uploads || model("Uploads", uploadSchema);
export const Quiz = models.Quiz || model("Quiz", quizSchema);
export const FederatedCredentials =
  models.FederatedCredentials || model("FederatedCredentials", federatedSchema);

// export default {
//   Users,
//   Activities,
//   Settings,
//   Friends,
//   Messages,
//   Notifications,
//   FriendRequests,
//   Uploads,
//   Quiz,
//   FederatedCredentials,
// };
