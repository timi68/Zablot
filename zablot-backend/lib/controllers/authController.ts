import { NextFunction as Next, Request as Req, Response as Res } from "express";
import JWT from "jsonwebtoken";
import Emailer from "@lib/emailer";
import * as token from "@lib/token";
import { STATUS } from "@lib/constants";
import { Users } from "@models/index";
import HttpError from "@lib/httpError";
import axios from "axios";
import validatePhoneNumber from "@helpers/validatePhoneNumber";
import { email } from "@lib/emailer";

const SECRET_KEY = process.env.SECRET_KEY as string;
const BASE_URL = process.env.BASE_URL;

export default class AuthController {
  /**
   * **Function** - Send a link to user mail to help them validate their register email
   * # Steps
   * - Validate Request body
   * - Sign a token
   * - Send token to user email for change of password
   * - send response of { success: true } to client
   */
  static async sendEmail(req: Req, res: Res, next: Next) {
    try {
      const { email, firstName, type } = req.body;
      const user = { email, firstName };

      let token = JWT.sign(
        user,
        SECRET_KEY,
        type != "changed-password" ? { expiresIn: "2h" } : {}
      );

      await Emailer(email, type, {
        firstName,
        verify_url: `${BASE_URL}/email/verified?token=${token}`,
      });

      return res.json({ success: true });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * # Steps
   * - Check if email exist in database - (throw bad request error, if not exist)
   * - Generate a token
   * - Send token to user email for change of password
   * - send response of { success: true } to client
   */
  static async authorizedChangeRequest(req: Req, res: Res, next: Next) {
    try {
      const { email } = req.body;

      if (!email) throw new HttpError("email not provided", STATUS.BAD_REQUEST);

      // check if the email has been registered
      const user = await Users.findOne(
        { email },
        { email: 1, firstName: 1 }
      ).lean<Zablot.User>();

      if (!user)
        throw new HttpError(
          "The email you entered has no account with us",
          STATUS.NOT_FOUND
        );

      let accessToken = token.create(user, "2h");

      await Emailer(email, email.CHANGE, {
        firstName: user.firstName,
        verify_url: `${BASE_URL}/reset-password?token=${accessToken}`,
      });

      return res.json({
        success: true,
        message:
          "We have sent a link to your email. Please use the link to reset your password. Expires in 2hours",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * # Steps
   * - Make a request to termii for code verification
   * - If termii request returns error - server return ```Verification expired```
   * - if verified returns verified ```true```
   * - else return verified ```false```
   *
   */
  static async verifyCode(req: Req, res: Res, next: Next) {
    try {
      let { phoneNumber, verification_id, code } = req.body;

      if (!phoneNumber || !verification_id || !code) {
        throw new HttpError("Incomplete details", STATUS.BAD_REQUEST);
      }

      let data = {
        api_key: process.env.TERMII_API_KEY,
        pin_id: verification_id,
        pin: code,
      };

      axios
        .post<{ attemptsRemaining: number; verified: boolean }>(
          "https://api.ng.termii.com/api/sms/otp/verify",
          data
        )
        .then(({ data }) => {
          if (!data.verified) {
            return res.json({
              verified: false,
              message: "Invalid Code!",
              attemptsRemaining: data.attemptsRemaining,
            });
          }

          // if verification pass, update user phone number field in the database
          req.body = { phoneNumber };
          res.locals.client = {
            attemptsRemaining: data.attemptsRemaining,
            verification_id,
            verified: true,
            message: "phone number updated successfully",
          };

          next();
        })
        .catch((_error) => {
          res.json({
            verified: false,
            message: "Verification expired!",
          });
        });
    } catch (error) {
      next(error);
    }
  }

  /**
   * # Steps
   * - Check if phoneNumber is provided in req.body
   * - Check if phone number is valid
   * - Make a request to termii to send code to provided phone number
   * - Get code id from termii request response
   *
   */
  static async sendCode(req: Req, res: Res, next: Next) {
    try {
      let { phoneNumber } = req.body as { phoneNumber: string };

      if (!phoneNumber)
        throw new HttpError("Incomplete fields", STATUS.BAD_REQUEST);

      if (!validatePhoneNumber(phoneNumber))
        throw new HttpError("Invalid Phone Number", STATUS.BAD_REQUEST);

      var data = {
        api_key: process.env.TERMII_API_KEY as string,
        message_type: "NUMERIC",
        to: phoneNumber,
        from: "N-Alert",
        channel: "dnd",
        pin_attempts: 10,
        pin_time_to_live: 30,
        pin_length: 6,
        pin_placeholder: "< 1234 >",
        message_text:
          "Your Zablot confirmation code is < 1234 >. it expires in 30minute",
        pin_type: "NUMERIC",
      };

      const sendCode = await axios.post(
        "https://api.ng.termii.com/api/sms/otp/send",
        data
      );

      const response = await sendCode.data;
      return res.json({
        success: true,
        message: `Verification code sent to ${phoneNumber}, code expires in 30mins`,
        verification_id: response.pinId,
      });
    } catch (error) {
      next(error);
    }
  }
}
