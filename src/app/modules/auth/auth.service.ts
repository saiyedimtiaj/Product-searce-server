import httpStatus from "http-status";
import config from "../../config";
import { TLogin, TUser } from "./auth.interface";
import { Users } from "./auth.modal";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";

const createUserIntoDb = async (payload: TUser) => {
  const { password, ...userinfo } = payload;
  const isExistUser = await Users.findOne({ email: payload.email });
  if (isExistUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exist!");
  }
  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_round);
  const result = await Users.create({ password: hashedPassword, ...userinfo });
  return result;
};

const loginUserIntoDb = async (payload: TLogin) => {
  const isUserExist = await Users.findOne({ email: payload.email }).select(
    "+password"
  );
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist!");
  }
  const matchPassword = await bcrypt.compare(
    payload.password,
    isUserExist.password
  );
  if (!matchPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorize!");
  }
  const data = {
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const accessToken = jwt.sign(data, config.jwt_access_secret as string, {
    expiresIn: config.jwt_secret_expirein,
  });

  const refreshToken = jwt.sign(data, config.jwt_refresh_secret as string, {
    expiresIn: config.jwt_refresh_expires_in,
  });

  return { data: isUserExist, accessToken, refreshToken };
};

const refreshToken = async (token: string) => {
  const decoded = jwt.verify(token, config.jwt_refresh_secret as string);
  const { email, role } = decoded as JwtPayload;
  const isExistUser = await Users.findOne({ email: email });
  if (!isExistUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist!");
  }
  const jwtPayload = { email, role };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_secret_expirein,
  });
  return accessToken;
};

export const userServices = {
  createUserIntoDb,
  loginUserIntoDb,
  refreshToken,
};
