export type UserRole = "ADMIN" | "EMPLOYEE";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
};

export type ClientStatus = "LEAD" | "ACTIVE" | "INACTIVE";
export type OpportunityStage =
  | "LEAD"
  | "QUALIFIED"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "WON"
  | "LOST";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type Client = {
  id: string;
  companyName: string;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  industry?: string | null;
  city?: string | null;
  country?: string | null;
  status: ClientStatus;
  annualRevenue?: string | number | null;
  ownerId: string;
  owner: User;
  _count?: {
    opportunities: number;
    tasks: number;
    notes: number;
  };
};

export type Opportunity = {
  id: string;
  title: string;
  description?: string | null;
  stage: OpportunityStage;
  estimatedValue: string | number;
  probability: number;
  expectedCloseDate?: string | null;
  lostReason?: string | null;
  clientId: string;
  ownerId: string;
  client: Pick<Client, "id" | "companyName" | "status">;
  owner: User;
  _count?: {
    tasks: number;
    notes: number;
  };
};

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  completedAt?: string | null;
  client?: Pick<Client, "id" | "companyName"> | null;
  opportunity?: Pick<Opportunity, "id" | "title" | "stage"> | null;
  assignee: User;
  createdBy: User;
};

export type AuthSession = {
  accessToken: string;
  user: User;
};
