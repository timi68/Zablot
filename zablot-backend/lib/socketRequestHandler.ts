import type { IncomingMessage } from "http";
import jwt from "jsonwebtoken";

export default function socketRequestHandler(
  req: IncomingMessage,
  callback: (error: any, pass: boolean) => void
) {
  // Extract the Authorization header from the request
  const authHeader = req.headers.authorization;
  // Check if the Authorization header exists and starts with "Bearer "
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Extract the token from the Authorization header
    const token = authHeader.substring(7);

    try {
      // Verify the token using the JWT library
      const decoded = jwt.verify(token, process.env.SECRET_KEY as string);
      // @ts-ignore
      req.user = decoded;

      // Call the next middleware or continue processing the request
      callback(null, true);
    } catch (error) {
      // If the token verification fails, return an error response
      return callback("Invalid or Expired auth", false);
    }
  } else {
    // If the Authorization header is missing or doesn't start with "Bearer ",
    // return an error response
    return callback("Bearer token required", false);
  }
}
