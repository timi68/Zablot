import axios from "axios";
// import { Users } from "@server/models";
// export default async function getUser(user_id: string) {
//   return await Users.findById(user_id, {
//     All_Logins: 0,
//     Online: 0,
//     Last_Seen: 0,
//     Account_Creation_Date: 0,
//     DateOfBirth: 0,
//     Password: 0,
//   })
//     .populate("friendRequests")
//     .populate("Notifications")
//     .populate("Settings")
//     .populate("Friends");
// }

export default async function getUser(
  sid: string
): Promise<{
  success: boolean;
  user?: Omit<Zablot.User, "friends" | "friendRequests" | "notifications">;
}> {
  try {
    // let path = (process.env.SERVER_URL as string) + "/user";
    // const response = await axios.get<{ success: boolean; user: Zablot.User }>(
    //   path,
    //   {
    //     headers: { Authorization: sid },
    //     validateStatus: (status) => status < 500,
    //   }
    // );

    // return await response.data;

    return {
      success: true,
      user: {
        _id: "65091a3777347eb87436dc92",
        firstName: "Timi",
        lastName: "James",
        userName: "TimiJames24717",
        email: "oderindejames02@gmail.com",
        provider: "google",
        settings: [],
        image: { profile: "", cover: "" },
        pendingRequests: [],
        online: false,
        coins: 0,
        verified: true,
        createdAt: "2023-09-19T03:49:11.349Z",
        lastSeen:
          "Wed Sep 20 2023 02:31:49 GMT+0100 (West Africa Standard Time)",
      },
    };
  } catch (error) {
    return { success: false };
  }
}
