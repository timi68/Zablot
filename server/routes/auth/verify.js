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
    const federated = await FederatedCredentials.findOne({
      provider: profile.provider,
      subject: profile.id,
    });

    if (isEmpty(federated)) {
      let created = {}

      const userExist = await Users.findOne({Provider: profile.provider, Sub: profile.id});
      
      if(isEmpty(userExist)){
          let body = {
            fullName: profile.displayName,
            UserName: "",
            provider: profile.provider,
            picture: profile.picture,
            verified: profile.verified,
            userEmail: profile.email,
            subject: profile.sub,
            userGender: profile.gender,
            password: profile.email.substring(0, 5) + "TJ345#",
          };
          /**
           * @type {{success: boolean; sessionUser: {user: string;}}}
           */
          let create = await AddUser(body);

                if (!create.success) {
                  return cb(created, false);
                }

          created = create.sessionUser

      }

      else created = {user: userExist._id}
      

      FederatedCredentials.create({
        provider: profile.provider,
        subject: profile.sub,
      });

      return cb(null, created.sessionUser);
    } else {
      const user = await Users.findOne({
        Sub: profile.sub,
        Provider: profile.provider,
      });

      if (isEmpty(user)) {
        return cb("User not found", false);
      }

      return cb(null, { _id: user._id });
    }
  } catch (error) {
    cb(error, false);
  }
} 

module.exports = verify;
