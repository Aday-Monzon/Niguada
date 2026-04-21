import { OpportunityStage, Prisma } from "@prisma/client";
import { AppError } from "../../common/errors/app-error";
import { buildPaginationMeta, getPagination } from "../../common/utils/pagination";
import { prisma } from "../../lib/prisma";

const opportunityInclude = {
  client: {
    select: {
      id: true,
      companyName: true,
      status: true
    }
  },
  owner: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true
    }
  },
  _count: {
    select: {
      tasks: true,
      notes: true
    }
  }
} satisfies Prisma.OpportunityInclude;

const ensureOpportunityExists = async (id: string) => {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      ...opportunityInclude,
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

  if (!opportunity) {
    throw new AppError(404, "Opportunity not found");
  }

  return opportunity;
};

export const opportunityService = {
  async list(query: {
    page: number;
    pageSize: number;
    search?: string;
    stage?: OpportunityStage;
    clientId?: string;
    ownerId?: string;
  }) {
    const where: Prisma.OpportunityWhereInput = {
      clientId: query.clientId,
      ownerId: query.ownerId,
      stage: query.stage,
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
      prisma.opportunity.findMany({
        where,
        include: opportunityInclude,
        orderBy: { createdAt: "desc" },
        skip,
        take
      }),
      prisma.opportunity.count({ where })
    ]);

    return {
      data: items,
      meta: buildPaginationMeta(query.page, query.pageSize, total)
    };
  },

  async getById(id: string) {
    return ensureOpportunityExists(id);
  },

  async create(payload: Prisma.OpportunityUncheckedCreateInput) {
    return prisma.opportunity.create({
      data: payload,
      include: opportunityInclude
    });
  },

  async update(id: string, payload: Prisma.OpportunityUncheckedUpdateInput) {
    await ensureOpportunityExists(id);

    return prisma.opportunity.update({
      where: { id },
      data: payload,
      include: opportunityInclude
    });
  },

  async remove(id: string) {
    await ensureOpportunityExists(id);
    await prisma.opportunity.delete({
      where: { id }
    });
  }
};
