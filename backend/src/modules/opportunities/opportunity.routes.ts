import { UserRole } from "@prisma/client";
import { Router } from "express";
import { authenticate } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import { asyncHandler } from "../../common/utils/async-handler";
import { opportunityController } from "./opportunity.controller";
import {
  createOpportunitySchema,
  opportunityListQuerySchema,
  opportunityParamsSchema,
  updateOpportunitySchema
} from "./opportunity.schemas";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  validate({ query: opportunityListQuerySchema }),
  asyncHandler(opportunityController.list)
);
router.get(
  "/:id",
  validate({ params: opportunityParamsSchema }),
  asyncHandler(opportunityController.getById)
);
router.post(
  "/",
  validate({ body: createOpportunitySchema }),
  asyncHandler(opportunityController.create)
);
router.patch(
  "/:id",
  validate({ params: opportunityParamsSchema, body: updateOpportunitySchema }),
  asyncHandler(opportunityController.update)
);
router.delete(
  "/:id",
  authorize(UserRole.ADMIN),
  validate({ params: opportunityParamsSchema }),
  asyncHandler(opportunityController.remove)
);

export const opportunityRouter = router;
