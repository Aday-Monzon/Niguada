import { Prisma, TaskPriority, TaskStatus } from "@prisma/client";
import { AppError } from "../../common/errors/app-error";
import { buildPaginationMeta, getPagination } from "../../common/utils/pagination";
import { prisma } from "../../lib/prisma";

const taskInclude = {
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
  },
  assignee: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true
    }
  },
  createdBy: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true
    }
  }
} satisfies Prisma.TaskInclude;

export const taskService = {
  async list(query: {
    page: number;
    pageSize: number;
    search?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assigneeId?: string;
    clientId?: string;
    opportunityId?: string;
  }) {
    const where: Prisma.TaskWhereInput = {
      status: query.status,
      priority: query.priority,
      assigneeId: query.assigneeId,
      clientId: query.clientId,
      opportunityId: query.opportunityId,
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: "insensitive" } },
              { description: { contains: query.search, mode: "insensitive" } }
            ]
          }
        : {})
    };

    const { skip, take } = getPagination(query.page, query.pageSize);
    const [items, total] = await prisma.$transaction([
      prisma.task.findMany({
        where,
        include: taskInclude,
        orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
        skip,
        take
      }),
      prisma.task.count({ where })
    ]);

    return {
      data: items,
      meta: buildPaginationMeta(query.page, query.pageSize, total)
    };
  },

  async getById(id: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: taskInclude
    });

    if (!task) {
      throw new AppError(404, "Task not found");
    }

    return task;
  },

  async create(payload: Prisma.TaskUncheckedCreateInput) {
    return prisma.task.create({
      data: payload,
      include: taskInclude
    });
  },

  async update(id: string, payload: Prisma.TaskUncheckedUpdateInput) {
    await this.getById(id);

    return prisma.task.update({
      where: { id },
      data: payload,
      include: taskInclude
    });
  },

  async remove(id: string) {
    await this.getById(id);
    await prisma.task.delete({
      where: { id }
    });
  }
};
