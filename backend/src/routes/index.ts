import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { clientRouter } from "../modules/clients/client.routes";
import { opportunityRouter } from "../modules/opportunities/opportunity.routes";
import { taskRouter } from "../modules/tasks/task.routes";
import { noteRouter } from "../modules/notes/note.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    data: {
      status: "ok"
    },
    error: null
  });
});

router.use("/auth", authRouter);
router.use("/clients", clientRouter);
router.use("/opportunities", opportunityRouter);
router.use("/tasks", taskRouter);
router.use("/notes", noteRouter);

export const apiRouter = router;
