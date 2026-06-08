import {
  ClientStatus,
  OpportunityStage,
  PrismaClient,
  TaskPriority,
  TaskStatus,
  UserRole
} from "@prisma/client";
import dotenv from "dotenv";
import { hashPassword } from "../src/common/utils/password";

dotenv.config();

const prisma = new PrismaClient();

const date = (value: string) => new Date(`${value}T00:00:00.000Z`);

const requiredSeedEnv = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing ${key} environment variable for Prisma seed`);
  }

  return value;
};

export const disconnectSeedPrisma = async () => {
  await prisma.$disconnect();
};

export const seed = async () => {
  const adminEmail = requiredSeedEnv("SEED_ADMIN_EMAIL");
  const adminPassword = await hashPassword(requiredSeedEnv("SEED_ADMIN_PASSWORD"));
  const saraEmail = requiredSeedEnv("SEED_EMPLOYEE_EMAIL");
  const diegoEmail = requiredSeedEnv("SEED_SECOND_EMPLOYEE_EMAIL");
  const employeePassword = await hashPassword(requiredSeedEnv("SEED_EMPLOYEE_PASSWORD"));

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
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
      email: adminEmail,
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      isActive: true
    }
  });

  const sara = await prisma.user.upsert({
    where: { email: saraEmail },
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
      email: saraEmail,
      passwordHash: employeePassword,
      role: UserRole.EMPLOYEE,
      isActive: true
    }
  });

  const diego = await prisma.user.upsert({
    where: { email: diegoEmail },
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
      email: diegoEmail,
      passwordHash: employeePassword,
      role: UserRole.EMPLOYEE,
      isActive: true
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
      contactEmail: "laura.diaz@acmelogistics.example",
      contactPhone: "+34 928 111 222",
      website: "https://acmelogistics.example",
      industry: "Logistica",
      status: ClientStatus.ACTIVE,
      addressLine1: "Calle Triana 18",
      city: "Las Palmas de Gran Canaria",
      state: "Las Palmas",
      postalCode: "35002",
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
      contactEmail: "carlos.vega@nimbus-studio.example",
      contactPhone: "+34 910 333 444",
      website: "https://nimbus-studio.example",
      industry: "Software",
      status: ClientStatus.LEAD,
      addressLine1: "Paseo de la Castellana 91",
      city: "Madrid",
      state: "Madrid",
      postalCode: "28046",
      country: "Spain",
      annualRevenue: 90000,
      employeeCount: 12,
      ownerId: diego.id
    }
  });

  const atlantic = await prisma.client.create({
    data: {
      companyName: "Atlantic Retail Group",
      contactName: "Marta Suarez",
      contactEmail: "marta.suarez@atlanticretail.example",
      contactPhone: "+34 922 222 908",
      website: "https://atlanticretail.example",
      industry: "Retail",
      status: ClientStatus.ACTIVE,
      addressLine1: "Avenida Maritima 44",
      city: "Santa Cruz de Tenerife",
      state: "Santa Cruz de Tenerife",
      postalCode: "38003",
      country: "Spain",
      annualRevenue: 720000,
      employeeCount: 96,
      ownerId: sara.id
    }
  });

  const volcan = await prisma.client.create({
    data: {
      companyName: "Volcan BioTech",
      contactName: "Irene Navarro",
      contactEmail: "irene.navarro@volcanbiotech.example",
      contactPhone: "+34 928 784 118",
      website: "https://volcanbiotech.example",
      industry: "Biotecnologia",
      status: ClientStatus.LEAD,
      addressLine1: "Parque Cientifico Tecnologico",
      city: "Telde",
      state: "Las Palmas",
      postalCode: "35200",
      country: "Spain",
      annualRevenue: 180000,
      employeeCount: 18,
      ownerId: diego.id
    }
  });

  const meridian = await prisma.client.create({
    data: {
      companyName: "Meridian Hotels",
      contactName: "Pablo Herrera",
      contactEmail: "pablo.herrera@meridianhotels.example",
      contactPhone: "+34 928 456 901",
      website: "https://meridianhotels.example",
      industry: "Hospitality",
      status: ClientStatus.INACTIVE,
      addressLine1: "Avenida de Tirajana 12",
      city: "Maspalomas",
      state: "Las Palmas",
      postalCode: "35100",
      country: "Spain",
      annualRevenue: 1200000,
      employeeCount: 210,
      ownerId: sara.id
    }
  });

  const isla = await prisma.client.create({
    data: {
      companyName: "Isla Verde Foods",
      contactName: "Natalia Cabrera",
      contactEmail: "natalia.cabrera@islaverdefoods.example",
      contactPhone: "+34 922 640 771",
      website: "https://islaverdefoods.example",
      industry: "Alimentacion",
      status: ClientStatus.ACTIVE,
      addressLine1: "Poligono Industrial Valle de Guimar",
      city: "Guimar",
      state: "Santa Cruz de Tenerife",
      postalCode: "38509",
      country: "Spain",
      annualRevenue: 460000,
      employeeCount: 58,
      ownerId: diego.id
    }
  });

  const nimbusContactOpportunity = await prisma.opportunity.create({
    data: {
      title: "Discovery inicial para ERP ligero",
      description: "Primer contacto para entender procesos de inventario, compras y reporting.",
      stage: OpportunityStage.LEAD,
      estimatedValue: 12000,
      probability: 20,
      expectedCloseDate: date("2026-07-10"),
      clientId: nimbus.id,
      ownerId: diego.id
    }
  });

  const atlanticProposalOpportunity = await prisma.opportunity.create({
    data: {
      title: "Automatizacion de fidelizacion omnicanal",
      description: "Propuesta para conectar ventas fisicas, ecommerce y campanas recurrentes.",
      stage: OpportunityStage.PROPOSAL,
      estimatedValue: 32000,
      probability: 55,
      expectedCloseDate: date("2026-09-10"),
      clientId: atlantic.id,
      ownerId: sara.id
    }
  });

  const acmeNegotiationOpportunity = await prisma.opportunity.create({
    data: {
      title: "Implantacion CRM comercial Q3",
      description: "Negociacion del alcance final para coordinar ventas, soporte y operaciones.",
      stage: OpportunityStage.NEGOTIATION,
      estimatedValue: 18000,
      probability: 70,
      expectedCloseDate: date("2026-07-15"),
      clientId: acme.id,
      ownerId: sara.id
    }
  });

  const islaWonOpportunity = await prisma.opportunity.create({
    data: {
      title: "Portal B2B para distribuidores",
      description: "Proyecto cerrado para centralizar pedidos y seguimiento comercial.",
      stage: OpportunityStage.WON,
      estimatedValue: 14500,
      probability: 100,
      expectedCloseDate: date("2026-06-30"),
      clientId: isla.id,
      ownerId: diego.id
    }
  });

  const meridianLostOpportunity = await prisma.opportunity.create({
    data: {
      title: "Suite CRM para cadena hotelera",
      description: "Oportunidad perdida tras pausar inversiones digitales.",
      stage: OpportunityStage.LOST,
      estimatedValue: 22000,
      probability: 0,
      expectedCloseDate: date("2026-06-25"),
      lostReason: "Presupuesto congelado hasta el proximo ejercicio.",
      clientId: meridian.id,
      ownerId: sara.id
    }
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Preparar propuesta comercial para Acme",
        description: "Cerrar alcance, pricing y calendario de implantacion antes de la llamada final.",
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: date("2026-06-20"),
        clientId: acme.id,
        opportunityId: acmeNegotiationOpportunity.id,
        assigneeId: sara.id,
        createdById: admin.id
      },
      {
        title: "Agendar discovery con Nimbus Studio",
        description: "Coordinar sesion con direccion de operaciones y tecnologia.",
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: date("2026-06-24"),
        clientId: nimbus.id,
        opportunityId: nimbusContactOpportunity.id,
        assigneeId: diego.id,
        createdById: admin.id
      },
      {
        title: "Enviar version final a Atlantic Retail",
        description: "Validar entregables y enviar la propuesta revisada.",
        status: TaskStatus.TODO,
        priority: TaskPriority.URGENT,
        dueDate: date("2026-06-18"),
        clientId: atlantic.id,
        opportunityId: atlanticProposalOpportunity.id,
        assigneeId: sara.id,
        createdById: admin.id
      },
      {
        title: "Registrar handoff de Isla Verde Foods",
        description: "Pasar contexto comercial al equipo de implantacion.",
        status: TaskStatus.DONE,
        priority: TaskPriority.LOW,
        dueDate: date("2026-06-12"),
        completedAt: new Date("2026-06-11T10:30:00.000Z"),
        clientId: isla.id,
        opportunityId: islaWonOpportunity.id,
        assigneeId: diego.id,
        createdById: admin.id
      },
      {
        title: "Documentar perdida de Meridian Hotels",
        description: "Anotar motivo de perdida y programar revision para Q1.",
        status: TaskStatus.DONE,
        priority: TaskPriority.MEDIUM,
        dueDate: date("2026-06-14"),
        completedAt: new Date("2026-06-13T16:00:00.000Z"),
        clientId: meridian.id,
        opportunityId: meridianLostOpportunity.id,
        assigneeId: sara.id,
        createdById: admin.id
      }
    ]
  });

  await prisma.note.createMany({
    data: [
      {
        content: "Acme quiere priorizar automatizacion de tareas y reporting semanal.",
        clientId: acme.id,
        opportunityId: acmeNegotiationOpportunity.id,
        authorId: sara.id
      },
      {
        content: "Nimbus necesita una demo corta antes de pasar a fase de propuesta.",
        clientId: nimbus.id,
        opportunityId: nimbusContactOpportunity.id,
        authorId: diego.id
      },
      {
        content: "Atlantic tiene interes en segmentacion por tienda y canal online.",
        clientId: atlantic.id,
        opportunityId: atlanticProposalOpportunity.id,
        authorId: sara.id
      },
      {
        content: "Volcan BioTech esta evaluando herramientas de seguimiento comercial para Q4.",
        clientId: volcan.id,
        authorId: diego.id
      },
      {
        content: "Isla Verde Foods queda lista para kickoff con operaciones.",
        clientId: isla.id,
        opportunityId: islaWonOpportunity.id,
        authorId: diego.id
      }
    ]
  });
};

if (require.main === module) {
  seed()
    .then(async () => {
      await disconnectSeedPrisma();
    })
    .catch(async (error) => {
      console.error("Seed failed", error);
      await disconnectSeedPrisma();
      process.exit(1);
    });
}
