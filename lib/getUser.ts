import { Users } from "@server/models";
export default async function getUser(user_id: string) {
  return await Users.findById(user_id, {
    All_Logins: 0,
    Online: 0,
    Last_Seen: 0,
    Account_Creation_Date: 0,
    DateOfBirth: 0,
    Password: 0,
  })
    .populate("FriendRequests")
    .populate("Notifications")
    .populate("Settings")
    .populate("Friends");
}
