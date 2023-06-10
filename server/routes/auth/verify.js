const { IncomingMessage } = require("http");
const { Users, FederatedCredentials } = require("../../models/index");
const { AddUser } = require("../users_control");
const isEmpty = require("lodash/isEmpty");

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

    if (!isEmpty(federatedUser)) {
      console.log({ federatedUser });
      const user = await Users.findOne({
        Sub: profile.sub,
        Provider: profile.provider,
      });

      if (isEmpty(user)) return cb("User not found", false);
      return cb(null, { _id: user._id });
    }

    /**
     * @type {{_id: string} | undefined}
     */
    let created;

    // check if user exist in Users database
    const userExist = await Users.findOne({
      Provider: profile.provider,
      Sub: profile.id,
    });

    if (isEmpty(userExist)) {
      let body = {
        fullName: profile.displayName,
        UserName: "",
        provider: profile.provider,
        picture: profile.picture,
        verified: profile.verified,
        userEmail: profile.email,
        subject: profile.sub,
        userGender: profile.gender,
        userPassword: profile.email.substring(0, 5) + "TJ345#",
      };

      // Create user
      let create = await AddUser(body, true);

      // check if creating user is successful
      if (!create.success)
        return cb("Error authenticating you with google", false);

      created = create.sessionUser;
    } else created = { user: userExist._id };

    FederatedCredentials.create({
      provider: profile.provider,
      subject: profile.sub,
      user: created._id,
    });

    return cb(null, created.sessionUser);
  } catch (error) {
    cb(error, false);
  }
}

module.exports = verify;
