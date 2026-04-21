import { apiClient, unwrapList } from "../../lib/api/client";
import { Task } from "../../types/domain";
import { PaginatedResult } from "../../types/api";

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

export type TaskListParams = {
  page: number;
  pageSize: number;
  search?: string;
  status?: Task["status"];
  priority?: Task["priority"];
  assigneeId?: string;
  clientId?: string;
  opportunityId?: string;
};

export const tasksApi = {
  async list(params: TaskListParams): Promise<PaginatedResult<Task>> {
    const response = await apiClient.get<Task[]>("/tasks", params);
    return unwrapList(response);
  },
  async getById(id: string) {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data;
  },
  async create(payload: TaskPayload) {
    const response = await apiClient.post<Task>("/tasks", payload);
    return response.data;
  },
  async update(id: string, payload: Partial<TaskPayload>) {
    const response = await apiClient.patch<Task>(`/tasks/${id}`, payload);
    return response.data;
  },
  async remove(id: string) {
    await apiClient.delete(`/tasks/${id}`);
  }
};
