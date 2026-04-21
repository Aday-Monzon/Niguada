import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodTypeAny } from "zod";

type Schemas = {
  body?: ZodTypeAny;
  params?: AnyZodObject;
  query?: AnyZodObject;
};

export const validate = (schemas: Schemas) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (schemas.body) {
      req.body = await schemas.body.parseAsync(req.body);
    }

    if (schemas.params) {
      req.params = await schemas.params.parseAsync(req.params);
    }

    if (schemas.query) {
      req.query = await schemas.query.parseAsync(req.query);
    }

    return next();
  };
};
