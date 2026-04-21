import { Prisma } from "@prisma/client";
import { AppError } from "../../common/errors/app-error";
import { buildPaginationMeta, getPagination } from "../../common/utils/pagination";
import { prisma } from "../../lib/prisma";

const noteInclude = {
  author: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true
    }
  },
  client: {
    select: {
      id: true,
      companyName: true
    }
  },
  opportunity: {
    select: {
      id: true,
      title: true,
      stage: true
    }
  }
} satisfies Prisma.NoteInclude;

export const noteService = {
  async list(query: {
    page: number;
    pageSize: number;
    clientId?: string;
    opportunityId?: string;
    authorId?: string;
  }) {
    const where: Prisma.NoteWhereInput = {
      clientId: query.clientId,
      opportunityId: query.opportunityId,
      authorId: query.authorId
    };

    const { skip, take } = getPagination(query.page, query.pageSize);
    const [items, total] = await prisma.$transaction([
      prisma.note.findMany({
        where,
        include: noteInclude,
        orderBy: { createdAt: "desc" },
        skip,
        take
      }),
      prisma.note.count({ where })
    ]);

    return {
      data: items,
      meta: buildPaginationMeta(query.page, query.pageSize, total)
    };
  },

  async getById(id: string) {
    const note = await prisma.note.findUnique({
      where: { id },
      include: noteInclude
    });

    if (!note) {
      throw new AppError(404, "Note not found");
    }

    return note;
  },

  async create(payload: Prisma.NoteUncheckedCreateInput) {
    return prisma.note.create({
      data: payload,
      include: noteInclude
    });
  },

  async update(id: string, payload: Prisma.NoteUncheckedUpdateInput) {
    await this.getById(id);

    return prisma.note.update({
      where: { id },
      data: payload,
      include: noteInclude
    });
  },

  async remove(id: string) {
    await this.getById(id);
    await prisma.note.delete({
      where: { id }
    });
  }
};
