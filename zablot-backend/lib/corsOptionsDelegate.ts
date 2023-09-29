import { Request, Response } from "express";
import compressor from "compression";
import { CorsOptions } from "cors";
import { whitelist } from "@lib/constants";

const corsOptionsDelegate = function (
  req: Request,
  callback: (err: Error | null, options: CorsOptions) => void
) {
  var corsOptions;
  if (whitelist.includes(req.header("Origin") as string)) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

export default corsOptionsDelegate;
