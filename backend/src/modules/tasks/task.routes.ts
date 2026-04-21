import { UserRole } from "@prisma/client";
import { Router } from "express";
import { authenticate } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import { asyncHandler } from "../../common/utils/async-handler";
import { taskController } from "./task.controller";
import {
  createTaskSchema,
  taskListQuerySchema,
  taskParamsSchema,
  updateTaskSchema
} from "./task.schemas";

const router = Router();

router.use(authenticate);

router.get("/", validate({ query: taskListQuerySchema }), asyncHandler(taskController.list));
router.get("/:id", validate({ params: taskParamsSchema }), asyncHandler(taskController.getById));
router.post("/", validate({ body: createTaskSchema }), asyncHandler(taskController.create));
router.patch(
  "/:id",
  validate({ params: taskParamsSchema, body: updateTaskSchema }),
  asyncHandler(taskController.update)
);
router.delete(
  "/:id",
  authorize(UserRole.ADMIN),
  validate({ params: taskParamsSchema }),
  asyncHandler(taskController.remove)
);

export const taskRouter = router;
