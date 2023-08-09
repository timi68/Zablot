const { users_auth: dbs } = require("../../connection/mongodb.js");
const passport = require("passport");
// const { Strategy: LocalStrategy } = require("passport-local");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const verify = require("./verify");

// passport.use(
//   "login",
//   new LocalStrategy(
//     {
//       usernameField: "userEmail",
//       passwordField: "userPassword",
//     },
//     function (userEmail, userPassword, next) {
//       // Find the user
//       if (userEmail != undefined) {
//         dbs.findOne({ Email: userEmail }, (err, user) => {
//           user != null && !err
//             ? bcrypt.compare(userPassword, user.Password, (err, isMatch) => {
//                 if (err) throw err;

//                 isMatch
//                   ? next(null, user)
//                   : next(null, false, {
//                       message: "Password is incorrect",
//                     });
//               })
//             : !err
//             ? next(null, false, {
//                 message: "This e-mail address is not registered.",
//               })
//             : next(null, false, {
//                 message: "There is an error with base.. resolving issue",
//               });
//         });
//       }
//     }
//   )
// );

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      passReqToCallback: true,
      callbackURL: "/api/auth/oauth2/redirect/google",
    },
    verify
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, user);
  });
});

passport.deserializeUser(function (user, cb) {
  console.log({ user });
  process.nextTick(function () {
    return cb(null, user);
  });
});

// passport.deserializeUser(function (id, next) {
//   // Use the previously serialized user
//   dbs.findById(id, (err, user) => {
//     user != null && !err
//       ? next(null, user)
//       : next(null, false, { message: "Error" });
//   });
// });
