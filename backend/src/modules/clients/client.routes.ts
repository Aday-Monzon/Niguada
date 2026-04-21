import { UserRole } from "@prisma/client";
import { Router } from "express";
import { authenticate } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import { asyncHandler } from "../../common/utils/async-handler";
import {
  clientListQuerySchema,
  clientParamsSchema,
  createClientSchema,
  updateClientSchema
} from "./client.schemas";
import { clientController } from "./client.controller";

const router = Router();

router.use(authenticate);

router.get("/", validate({ query: clientListQuerySchema }), asyncHandler(clientController.list));
router.get(
  "/:id",
  validate({ params: clientParamsSchema }),
  asyncHandler(clientController.getById)
);
router.post("/", validate({ body: createClientSchema }), asyncHandler(clientController.create));
router.patch(
  "/:id",
  validate({ params: clientParamsSchema, body: updateClientSchema }),
  asyncHandler(clientController.update)
);
router.delete(
  "/:id",
  authorize(UserRole.ADMIN),
  validate({ params: clientParamsSchema }),
  asyncHandler(clientController.remove)
);

export const clientRouter = router;
