import { ClientStatus, Prisma } from "@prisma/client";
import { AppError } from "../../common/errors/app-error";
import { buildPaginationMeta, getPagination } from "../../common/utils/pagination";
import { prisma } from "../../lib/prisma";

const clientInclude = {
  owner: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true
    }
  },
  _count: {
    select: {
      opportunities: true,
      tasks: true,
      notes: true
    }
  }
} satisfies Prisma.ClientInclude;

export const clientService = {
  async list(query: {
    page: number;
    pageSize: number;
    search?: string;
    status?: ClientStatus;
    ownerId?: string;
  }) {
    const where: Prisma.ClientWhereInput = {
      status: query.status,
      ownerId: query.ownerId,
      ...(query.search
        ? {
            OR: [
              { companyName: { contains: query.search, mode: "insensitive" } },
              { contactName: { contains: query.search, mode: "insensitive" } },
              { contactEmail: { contains: query.search, mode: "insensitive" } }
            ]
          }
        : {})
    };

    const { skip, take } = getPagination(query.page, query.pageSize);
    const [items, total] = await prisma.$transaction([
      prisma.client.findMany({
        where,
        include: clientInclude,
        orderBy: { createdAt: "desc" },
        skip,
        take
      }),
      prisma.client.count({ where })
    ]);

    return {
      data: items,
      meta: buildPaginationMeta(query.page, query.pageSize, total)
    };
  },

  async getById(id: string) {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        ...clientInclude,
        opportunities: {
          select: {
            id: true,
            title: true,
            stage: true,
            estimatedValue: true,
            expectedCloseDate: true
          },
          orderBy: { createdAt: "desc" }
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            dueDate: true
          },
          orderBy: { createdAt: "desc" },
          take: 10
        },
        notes: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: "desc" },
          take: 10
        }
      }
    });

    if (!client) {
      throw new AppError(404, "Client not found");
    }

    return client;
  },

  async create(payload: Prisma.ClientUncheckedCreateInput) {
    return prisma.client.create({
      data: payload,
      include: clientInclude
    });
  },

  async update(id: string, payload: Prisma.ClientUncheckedUpdateInput) {
    await this.getById(id);

    return prisma.client.update({
      where: { id },
      data: payload,
      include: clientInclude
    });
  },

  async remove(id: string) {
    await this.getById(id);
    await prisma.client.delete({
      where: { id }
    });
  }
};
