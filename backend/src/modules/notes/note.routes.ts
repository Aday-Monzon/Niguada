import { UserRole } from "@prisma/client";
import { Router } from "express";
import { authenticate } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import { asyncHandler } from "../../common/utils/async-handler";
import { noteController } from "./note.controller";
import {
  createNoteSchema,
  noteListQuerySchema,
  noteParamsSchema,
  updateNoteSchema
} from "./note.schemas";

const router = Router();

router.use(authenticate);

router.get("/", validate({ query: noteListQuerySchema }), asyncHandler(noteController.list));
router.get("/:id", validate({ params: noteParamsSchema }), asyncHandler(noteController.getById));
router.post("/", validate({ body: createNoteSchema }), asyncHandler(noteController.create));
router.patch(
  "/:id",
  validate({ params: noteParamsSchema, body: updateNoteSchema }),
  asyncHandler(noteController.update)
);
router.delete(
  "/:id",
  authorize(UserRole.ADMIN),
  validate({ params: noteParamsSchema }),
  asyncHandler(noteController.remove)
);

export const noteRouter = router;
