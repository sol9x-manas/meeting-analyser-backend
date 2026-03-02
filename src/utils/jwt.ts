import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const generateAccessToken = (payload: any) => {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: any) => {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
};