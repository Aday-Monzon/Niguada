import { z } from "zod";
import { idParamSchema, paginationQuerySchema } from "../../common/schemas/common.schemas";

const noteTargetSchema = z
  .object({
    clientId: z.string().uuid().optional(),
    opportunityId: z.string().uuid().optional()
  })
  .refine((value) => value.clientId || value.opportunityId, {
    message: "A note must belong to a client or an opportunity",
    path: ["clientId"]
  });

export const noteListQuerySchema = paginationQuerySchema.extend({
  clientId: z.string().uuid().optional(),
  opportunityId: z.string().uuid().optional(),
  authorId: z.string().uuid().optional()
});

export const createNoteSchema = z
  .object({
    content: z.string().min(2).max(5000),
    clientId: z.string().uuid().optional(),
    opportunityId: z.string().uuid().optional()
  })
  .and(noteTargetSchema);

export const updateNoteSchema = z
  .object({
    content: z.string().min(2).max(5000).optional(),
    clientId: z.string().uuid().optional(),
    opportunityId: z.string().uuid().optional()
  })
  .refine(
    (value) =>
      value.clientId !== undefined ||
      value.opportunityId !== undefined ||
      value.content !== undefined,
    {
      message: "At least one field is required"
    }
  );

export const noteParamsSchema = idParamSchema;
