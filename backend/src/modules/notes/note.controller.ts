import { Request, Response } from "express";
import { noteService } from "./note.service";

export const noteController = {
  async list(req: Request, res: Response) {
    const result = await noteService.list(req.query as never);

    return res.status(200).json({
      data: result.data,
      meta: result.meta,
      error: null
    });
  },

  async getById(req: Request, res: Response) {
    const note = await noteService.getById(req.params.id);

    return res.status(200).json({
      data: note,
      error: null
    });
  },

  async create(req: Request, res: Response) {
    const note = await noteService.create({
      ...req.body,
      authorId: req.auth!.userId
    });

    return res.status(201).json({
      data: note,
      error: null
    });
  },

  async update(req: Request, res: Response) {
    const note = await noteService.update(req.params.id, req.body);

    return res.status(200).json({
      data: note,
      error: null
    });
  },

  async remove(req: Request, res: Response) {
    await noteService.remove(req.params.id);

    return res.status(204).send();
  }
};
