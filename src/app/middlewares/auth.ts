import jwt, { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import config from "../config";
import AppError from "../errors/AppError";

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You have no access to this route"
      );
    }
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;
    const { role } = decoded;

    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You do not have the required role to access this route"
      );
    }

    req.user = decoded;
    next();
  });
};

export default auth;
