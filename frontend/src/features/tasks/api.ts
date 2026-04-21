import { apiClient, unwrapList } from "../../lib/api/client";
import { Task } from "../../types/domain";

export type TaskPayload = {
  title: string;
  description?: string;
  status?: Task["status"];
  priority?: Task["priority"];
  dueDate?: string;
  clientId?: string;
  opportunityId?: string;
  assigneeId: string;
};

export const tasksApi = {
  async list(params: Record<string, string | number | undefined>) {
    const response = await apiClient.get<Task[]>("/tasks", params);
    return unwrapList(response);
  },
  async create(payload: TaskPayload) {
    return apiClient.post<Task>("/tasks", payload);
  },
  async update(id: string, payload: Partial<TaskPayload>) {
    return apiClient.patch<Task>(`/tasks/${id}`, payload);
  }
};
