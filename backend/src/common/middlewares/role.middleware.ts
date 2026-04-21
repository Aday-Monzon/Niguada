import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      return next(new AppError(401, "Authentication required"));
    }

    if (!roles.includes(req.auth.role)) {
      return next(new AppError(403, "Insufficient permissions"));
    }

    return next();
  };
};
