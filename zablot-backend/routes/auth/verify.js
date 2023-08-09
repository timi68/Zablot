const { IncomingMessage } = require("http");
const { Users, FederatedCredentials } = require("../../models/index");
const { AddUser } = require("../users_control");
const { isEmpty, pick } = require("lodash");

/**
 *
 * @param {IncomingMessage} request
 * @param {string} accessToken
 * @param {string|undefined} refreshToken
 * @param {{provider: string;name: string, gender?: string, email: string, sub: string, photos: object; verified: boolean}} profile
 * @param {(err: Error | string, user: object) => void} cb
 * @returns
 */
async function verify(request, accessToken, refreshToken, profile, cb) {
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

    /**
     * @type {{_id: string} | undefined}
     */
    let created;

    if (!user) {
      let body = {
        fullName: profile.displayName,
        userName:
          profile.displayName.replace(" ", "").toLowerCase() +
          Math.floor(Math.random() * 33943),
        provider: profile.provider,
        picture: profile.picture,
        verified: profile.verified,
        userEmail: profile.email,
        subject: profile.sub,
        userGender: profile.gender,
        userPassword: profile.email.substring(0, 5) + "TJ345#",
      };

      // Create user
      let { success, sessionUser } = await AddUser(body, true);

      // check if creating user is successful
      if (!success) return cb("Error authenticating you with google", false);

      FederatedCredentials.create({
        provider: profile.provider,
        subject: profile.sub,
        user: sessionUser.user,
      });

      created = sessionUser;
    } else created = { _id: user._id };

    return cb(null, created);
  } catch (error) {
    cb(error, false);
  }
}

module.exports = verify;
