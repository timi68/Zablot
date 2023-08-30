import { Request as Req, Response as Res, NextFunction as Next } from "express";

const ensureIsAuthenticated = (req: Req, res: Res, next: Next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
    res.end();
  }
};

export default ensureIsAuthenticated;
