import { Request, Response } from "express";
import { taskService } from "./task.service";

export const taskController = {
  async list(req: Request, res: Response) {
    const result = await taskService.list(req.query as never);

    return res.status(200).json({
      data: result.data,
      meta: result.meta,
      error: null
    });
  },

  async getById(req: Request, res: Response) {
    const task = await taskService.getById(req.params.id);

    return res.status(200).json({
      data: task,
      error: null
    });
  },

  async create(req: Request, res: Response) {
    const task = await taskService.create({
      ...req.body,
      createdById: req.auth!.userId
    });

    return res.status(201).json({
      data: task,
      error: null
    });
  },

  async update(req: Request, res: Response) {
    const task = await taskService.update(req.params.id, req.body);

    return res.status(200).json({
      data: task,
      error: null
    });
  },

  async remove(req: Request, res: Response) {
    await taskService.remove(req.params.id);

    return res.status(204).send();
  }
};
