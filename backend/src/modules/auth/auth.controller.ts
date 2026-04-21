import { Request, Response } from "express";
import { authService } from "./auth.service";

export const authController = {
  async login(req: Request, res: Response) {
    const result = await authService.login(req.body.email, req.body.password);

    return res.status(200).json({
      data: result,
      error: null
    });
  },

  async me(req: Request, res: Response) {
    const user = await authService.getCurrentUser(req.auth!.userId);

    return res.status(200).json({
      data: user,
      error: null
    });
  }
};
