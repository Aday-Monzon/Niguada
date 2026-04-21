import { TaskPriority, TaskStatus } from "@prisma/client";
import { z } from "zod";
import { idParamSchema, paginationQuerySchema } from "../../common/schemas/common.schemas";

export const taskListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  assigneeId: z.string().uuid().optional(),
  clientId: z.string().uuid().optional(),
  opportunityId: z.string().uuid().optional()
});

export const createTaskSchema = z.object({
  title: z.string().min(2).max(160),
  description: z.string().max(2000).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional(),
  clientId: z.string().uuid().optional(),
  opportunityId: z.string().uuid().optional(),
  assigneeId: z.string().uuid()
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskParamsSchema = idParamSchema;
