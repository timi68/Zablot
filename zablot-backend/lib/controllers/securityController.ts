import { STATUS } from "@lib/constants";
import HttpError from "@lib/httpError";
import { NextFunction, Request, Response } from "express";

export default class SecurityController {
  static accessor(
    this: string[],
    req: Request,
    _res: Response,
    next: NextFunction
  ) {
    try {
      const authorizedUserType = this;
      const user = req.user;

      // if (!authorizedUserType.includes(user.userType))
      //   throw new HttpError("Access Denied!", STATUS.FORBIDDEN);

      next();
    } catch (error) {
      next(error);
    }
  }
}
