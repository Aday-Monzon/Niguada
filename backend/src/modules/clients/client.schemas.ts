import { ClientStatus } from "@prisma/client";
import { z } from "zod";
import { idParamSchema, paginationQuerySchema } from "../../common/schemas/common.schemas";

export const clientListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
  status: z.nativeEnum(ClientStatus).optional(),
  ownerId: z.string().uuid().optional()
});

export const createClientSchema = z.object({
  companyName: z.string().min(2).max(150),
  contactName: z.string().min(2).max(120).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().min(6).max(30).optional(),
  taxId: z.string().max(50).optional(),
  website: z.string().url().optional(),
  industry: z.string().max(120).optional(),
  status: z.nativeEnum(ClientStatus).optional(),
  addressLine1: z.string().max(200).optional(),
  addressLine2: z.string().max(200).optional(),
  city: z.string().max(120).optional(),
  state: z.string().max(120).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().max(120).optional(),
  annualRevenue: z.number().nonnegative().optional(),
  employeeCount: z.number().int().nonnegative().optional(),
  ownerId: z.string().uuid()
});

export const updateClientSchema = createClientSchema.partial();

export const clientParamsSchema = idParamSchema;
