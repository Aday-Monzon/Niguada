import { Request, Response } from "express";
import { opportunityService } from "./opportunity.service";

export const opportunityController = {
  async list(req: Request, res: Response) {
    const result = await opportunityService.list(req.query as never);

    return res.status(200).json({
      data: result.data,
      meta: result.meta,
      error: null
    });
  },

  async getById(req: Request, res: Response) {
    const opportunity = await opportunityService.getById(req.params.id);

    return res.status(200).json({
      data: opportunity,
      error: null
    });
  },

  async create(req: Request, res: Response) {
    const opportunity = await opportunityService.create(req.body);

    return res.status(201).json({
      data: opportunity,
      error: null
    });
  },

  async update(req: Request, res: Response) {
    const opportunity = await opportunityService.update(req.params.id, req.body);

    return res.status(200).json({
      data: opportunity,
      error: null
    });
  },

  async remove(req: Request, res: Response) {
    await opportunityService.remove(req.params.id);

    return res.status(204).send();
  }
};
