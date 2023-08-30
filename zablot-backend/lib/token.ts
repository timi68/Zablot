import jwt from "jsonwebtoken";
import _ from "lodash";

const secretKey = process.env.SECRET_KEY as string;

// Function to create a token
export function create(payload: object, expiresIn: string) {
  return jwt.sign(payload, secretKey, { expiresIn });
}

// Function to verify and renew the token if expired
export function verifyAndRenew(token: string) {
  try {
    const decodedToken = jwt.verify(token, secretKey, {
      ignoreExpiration: true,
    }) as jwt.JwtPayload;

    // Check if the token is about to expire (e.g., within the next 5 minutes)
    const now = Date.now() / 1000;
    const expirationTime = decodedToken.exp;
    const timeUntilExpiration = expirationTime! - now;

    if (timeUntilExpiration < 300) {
      // If the token is about to expire, renew it with a new expiration time (e.g., 1 hour from now)
      const newToken = create(_.omit(decodedToken, ["exp", "iat"]), "1h");
      return {
        renewed: true,
        token: newToken,
      };
    }

    return {
      token,
      renewed: false,
    };
  } catch (error) {
    console.error({ error });
    // Token verification failed (expired or invalid)
    return {
      error: "Invalid Token",
    };
  }
}

export function verify(token: string) {
  try {
    const decodedToken = jwt.verify(token, secretKey) as jwt.JwtPayload;
    return { user: _.omit(decodedToken, ["exp", "iat"]) };
  } catch (error) {
    return { error: "Invalid or expired token" };
  }
}
