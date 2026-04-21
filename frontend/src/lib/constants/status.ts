import { ClientStatus, OpportunityStage, TaskPriority, TaskStatus } from "../../types/domain";

export const clientToneMap: Record<ClientStatus, "lead" | "active" | "inactive"> = {
  LEAD: "lead",
  ACTIVE: "active",
  INACTIVE: "inactive"
};

export const opportunityToneMap: Record<
  OpportunityStage,
  "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost"
> = {
  LEAD: "lead",
  QUALIFIED: "qualified",
  PROPOSAL: "proposal",
  NEGOTIATION: "negotiation",
  WON: "won",
  LOST: "lost"
};

export const taskStatusToneMap: Record<TaskStatus, "todo" | "progress" | "done" | "canceled"> = {
  TODO: "todo",
  IN_PROGRESS: "progress",
  DONE: "done",
  CANCELED: "canceled"
};

export const taskPriorityToneMap: Record<TaskPriority, "low" | "medium" | "high" | "urgent"> = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent"
};

export const humanizeStatus = (value: string) => value.replace(/_/g, " ");
