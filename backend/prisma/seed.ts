import { PrismaClient, UserRole, ClientStatus, OpportunityStage, TaskPriority, TaskStatus } from "@prisma/client";
import { hashPassword } from "../src/common/utils/password";

const prisma = new PrismaClient();

const seed = async () => {
  const adminPassword = await hashPassword("Admin123!");
  const employeePassword = await hashPassword("Employee123!");

  const admin = await prisma.user.upsert({
    where: { email: "admin@niguada.dev" },
    update: {
      firstName: "Aday",
      lastName: "Admin",
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      isActive: true
    },
    create: {
      firstName: "Aday",
      lastName: "Admin",
      email: "admin@niguada.dev",
      passwordHash: adminPassword,
      role: UserRole.ADMIN
    }
  });

  const sara = await prisma.user.upsert({
    where: { email: "sara@niguada.dev" },
    update: {
      firstName: "Sara",
      lastName: "Lopez",
      passwordHash: employeePassword,
      role: UserRole.EMPLOYEE,
      isActive: true
    },
    create: {
      firstName: "Sara",
      lastName: "Lopez",
      email: "sara@niguada.dev",
      passwordHash: employeePassword,
      role: UserRole.EMPLOYEE
    }
  });

  const diego = await prisma.user.upsert({
    where: { email: "diego@niguada.dev" },
    update: {
      firstName: "Diego",
      lastName: "Martin",
      passwordHash: employeePassword,
      role: UserRole.EMPLOYEE,
      isActive: true
    },
    create: {
      firstName: "Diego",
      lastName: "Martin",
      email: "diego@niguada.dev",
      passwordHash: employeePassword,
      role: UserRole.EMPLOYEE
    }
  });

  await prisma.note.deleteMany();
  await prisma.task.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.client.deleteMany();

  const acme = await prisma.client.create({
    data: {
      companyName: "Acme Logistics",
      contactName: "Laura Diaz",
      contactEmail: "laura@acme.com",
      contactPhone: "+34 600 111 222",
      industry: "Logistics",
      status: ClientStatus.ACTIVE,
      city: "Las Palmas",
      country: "Spain",
      annualRevenue: 250000,
      employeeCount: 45,
      ownerId: sara.id
    }
  });

  const nimbus = await prisma.client.create({
    data: {
      companyName: "Nimbus Studio",
      contactName: "Carlos Vega",
      contactEmail: "carlos@nimbus.dev",
      contactPhone: "+34 600 333 444",
      industry: "Software",
      status: ClientStatus.LEAD,
      city: "Madrid",
      country: "Spain",
      annualRevenue: 90000,
      employeeCount: 12,
      ownerId: diego.id
    }
  });

  const acmeOpportunity = await prisma.opportunity.create({
    data: {
      title: "CRM rollout Q3",
      description: "Deployment of CRM workflows for sales and support teams.",
      stage: OpportunityStage.NEGOTIATION,
      estimatedValue: 18000,
      probability: 70,
      expectedCloseDate: new Date("2026-06-15T00:00:00.000Z"),
      clientId: acme.id,
      ownerId: sara.id
    }
  });

  const nimbusOpportunity = await prisma.opportunity.create({
    data: {
      title: "ERP discovery phase",
      description: "Initial scoping for operations and inventory processes.",
      stage: OpportunityStage.QUALIFIED,
      estimatedValue: 9500,
      probability: 40,
      expectedCloseDate: new Date("2026-07-01T00:00:00.000Z"),
      clientId: nimbus.id,
      ownerId: diego.id
    }
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Prepare commercial proposal",
        description: "Draft commercial proposal for Acme stakeholders.",
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: new Date("2026-05-01T00:00:00.000Z"),
        clientId: acme.id,
        opportunityId: acmeOpportunity.id,
        assigneeId: sara.id,
        createdById: admin.id
      },
      {
        title: "Schedule discovery workshop",
        description: "Coordinate first workshop with Nimbus leadership team.",
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date("2026-05-08T00:00:00.000Z"),
        clientId: nimbus.id,
        opportunityId: nimbusOpportunity.id,
        assigneeId: diego.id,
        createdById: admin.id
      }
    ]
  });

  await prisma.note.createMany({
    data: [
      {
        content: "Client is especially interested in reporting and task automation.",
        clientId: acme.id,
        opportunityId: acmeOpportunity.id,
        authorId: sara.id
      },
      {
        content: "Prospect asked for a phased implementation proposal before June.",
        clientId: nimbus.id,
        opportunityId: nimbusOpportunity.id,
        authorId: diego.id
      }
    ]
  });
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed", error);
    await prisma.$disconnect();
    process.exit(1);
  });
