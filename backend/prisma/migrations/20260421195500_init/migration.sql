CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EMPLOYEE');
CREATE TYPE "ClientStatus" AS ENUM ('LEAD', 'ACTIVE', 'INACTIVE');
CREATE TYPE "OpportunityStage" AS ENUM ('LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST');
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'CANCELED');
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

CREATE TABLE "User" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'EMPLOYEE',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "lastLoginAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Client" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "companyName" TEXT NOT NULL,
  "contactName" TEXT,
  "contactEmail" TEXT,
  "contactPhone" TEXT,
  "taxId" TEXT,
  "website" TEXT,
  "industry" TEXT,
  "status" "ClientStatus" NOT NULL DEFAULT 'LEAD',
  "addressLine1" TEXT,
  "addressLine2" TEXT,
  "city" TEXT,
  "state" TEXT,
  "postalCode" TEXT,
  "country" TEXT,
  "annualRevenue" DECIMAL(14,2),
  "employeeCount" INTEGER,
  "ownerId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Opportunity" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "description" TEXT,
  "stage" "OpportunityStage" NOT NULL DEFAULT 'LEAD',
  "estimatedValue" DECIMAL(14,2) NOT NULL,
  "probability" INTEGER NOT NULL DEFAULT 10,
  "expectedCloseDate" TIMESTAMP(3),
  "lostReason" TEXT,
  "clientId" TEXT NOT NULL,
  "ownerId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Task" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
  "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
  "dueDate" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "clientId" TEXT,
  "opportunityId" TEXT,
  "assigneeId" TEXT NOT NULL,
  "createdById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Note" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "content" TEXT NOT NULL,
  "clientId" TEXT,
  "opportunityId" TEXT,
  "authorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "Client_ownerId_idx" ON "Client"("ownerId");
CREATE INDEX "Client_status_idx" ON "Client"("status");
CREATE INDEX "Client_companyName_idx" ON "Client"("companyName");
CREATE INDEX "Opportunity_clientId_idx" ON "Opportunity"("clientId");
CREATE INDEX "Opportunity_ownerId_idx" ON "Opportunity"("ownerId");
CREATE INDEX "Opportunity_stage_idx" ON "Opportunity"("stage");
CREATE INDEX "Opportunity_expectedCloseDate_idx" ON "Opportunity"("expectedCloseDate");
CREATE INDEX "Task_clientId_idx" ON "Task"("clientId");
CREATE INDEX "Task_opportunityId_idx" ON "Task"("opportunityId");
CREATE INDEX "Task_assigneeId_idx" ON "Task"("assigneeId");
CREATE INDEX "Task_createdById_idx" ON "Task"("createdById");
CREATE INDEX "Task_status_priority_idx" ON "Task"("status", "priority");
CREATE INDEX "Task_dueDate_idx" ON "Task"("dueDate");
CREATE INDEX "Note_clientId_idx" ON "Note"("clientId");
CREATE INDEX "Note_opportunityId_idx" ON "Note"("opportunityId");
CREATE INDEX "Note_authorId_idx" ON "Note"("authorId");
CREATE INDEX "Note_createdAt_idx" ON "Note"("createdAt");

ALTER TABLE "Client"
  ADD CONSTRAINT "Client_ownerId_fkey"
  FOREIGN KEY ("ownerId") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Opportunity"
  ADD CONSTRAINT "Opportunity_clientId_fkey"
  FOREIGN KEY ("clientId") REFERENCES "Client"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Opportunity"
  ADD CONSTRAINT "Opportunity_ownerId_fkey"
  FOREIGN KEY ("ownerId") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Task"
  ADD CONSTRAINT "Task_clientId_fkey"
  FOREIGN KEY ("clientId") REFERENCES "Client"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Task"
  ADD CONSTRAINT "Task_opportunityId_fkey"
  FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Task"
  ADD CONSTRAINT "Task_assigneeId_fkey"
  FOREIGN KEY ("assigneeId") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Task"
  ADD CONSTRAINT "Task_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Note"
  ADD CONSTRAINT "Note_clientId_fkey"
  FOREIGN KEY ("clientId") REFERENCES "Client"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Note"
  ADD CONSTRAINT "Note_opportunityId_fkey"
  FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Note"
  ADD CONSTRAINT "Note_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
