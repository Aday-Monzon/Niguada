import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { env } from "../../config/env";

type JwtPayload = {
  sub: string;
  role: UserRole;
};

export const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload & JwtPayload;
