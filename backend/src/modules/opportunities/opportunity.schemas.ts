import { OpportunityStage } from "@prisma/client";
import { z } from "zod";
import { idParamSchema, paginationQuerySchema } from "../../common/schemas/common.schemas";

export const opportunityListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
  stage: z.nativeEnum(OpportunityStage).optional(),
  clientId: z.string().uuid().optional(),
  ownerId: z.string().uuid().optional()
});

export const createOpportunitySchema = z.object({
  title: z.string().min(2).max(160),
  description: z.string().max(2000).optional(),
  stage: z.nativeEnum(OpportunityStage).optional(),
  estimatedValue: z.number().nonnegative(),
  probability: z.number().int().min(0).max(100).optional(),
  expectedCloseDate: z.coerce.date().optional(),
  lostReason: z.string().max(250).optional(),
  clientId: z.string().uuid(),
  ownerId: z.string().uuid()
});

export const updateOpportunitySchema = createOpportunitySchema.partial();

export const opportunityParamsSchema = idParamSchema;
