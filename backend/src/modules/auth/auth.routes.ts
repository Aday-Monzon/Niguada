import { Router } from "express";
import { asyncHandler } from "../../common/utils/async-handler";
import { validate } from "../../common/middlewares/validate.middleware";
import { authenticate } from "../../common/middlewares/auth.middleware";
import { authController } from "./auth.controller";
import { loginSchema } from "./auth.schemas";

const router = Router();

router.post("/login", validate({ body: loginSchema }), asyncHandler(authController.login));
router.get("/me", authenticate, asyncHandler(authController.me));

export const authRouter = router;
