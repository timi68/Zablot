import { IncomingMessage } from "http";
import { Users, FederatedCredentials } from "@models/index";
import { AddUser } from "@lib/users_control";
import { isEmpty, pick } from "lodash";
import { hashPassword } from "./crypto";

type googleProfile = {
  id: string;
  provider: string;
  name: string;
  gender?: string;
  email: string;
  sub: string;
  photos: object;
  verified: boolean;
  picture: string;
  displayName: string;
  given_name: string;
  family_name: string;
};

type cb = (err: string | null, user: object | false) => void;

/**
 *
 * @param {IncomingMessage} request
 * @param {string} accessToken
 * @param {string|undefined} refreshToken
 * @param {{provider: string;name: string, gender?: string, email: string, sub: string, photos: object; verified: boolean}} profile
 * @param {(err: string | string, user: object) => void} cb
 * @returns
 */
export default async function googleVerify(
  request: IncomingMessage,
  accessToken: string,
  refreshToken: string | undefined,
  profile: googleProfile,
  cb: cb
) {
  try {
    const federatedUser = await FederatedCredentials.findOne({
      provider: profile.provider,
      subject: profile.id,
    }).populate("user");

    // check if user exist in Users database
    const user = await Users.findOne({
      Provider: profile.provider,
      Sub: profile.id,
    });

    if (federatedUser && user) return cb(null, pick(user, "_id"));

    let created: { _id: string; email: string } | undefined;

    if (!user) {
      const newUser = await Users.create({
        firstName: profile.given_name,
        lastName: profile.family_name,
        userName: (
          profile.given_name +
          profile.family_name +
          Math.floor(Math.random() * 33943)
        ).toLowerCase(),
        provider: profile.provider,
        picture: profile.picture,
        verified: profile.verified,
        email: profile.email,
        subject: profile.sub,
        gender: profile.gender,
        password: await hashPassword(profile.email.substring(0, 5) + "TJ345#"),
      });

      FederatedCredentials.create({
        provider: profile.provider,
        subject: profile.sub,
        user: newUser._id,
      });

      created = { _id: newUser._id, email: newUser.email };
    } else created = { _id: user._id, email: user.email };

    return cb(null, created);
  } catch (error: any) {
    cb(error ?? "Error authenticating you with google", false);
  }
}
