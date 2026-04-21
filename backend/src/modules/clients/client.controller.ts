import { Request, Response } from "express";
import { clientService } from "./client.service";

export const clientController = {
  async list(req: Request, res: Response) {
    const result = await clientService.list(req.query as never);

    return res.status(200).json({
      data: result.data,
      meta: result.meta,
      error: null
    });
  },

  async getById(req: Request, res: Response) {
    const client = await clientService.getById(req.params.id);

    return res.status(200).json({
      data: client,
      error: null
    });
  },

  async create(req: Request, res: Response) {
    const client = await clientService.create(req.body);

    return res.status(201).json({
      data: client,
      error: null
    });
  },

  async update(req: Request, res: Response) {
    const client = await clientService.update(req.params.id, req.body);

    return res.status(200).json({
      data: client,
      error: null
    });
  },

  async remove(req: Request, res: Response) {
    await clientService.remove(req.params.id);

    return res.status(204).send();
  }
};
