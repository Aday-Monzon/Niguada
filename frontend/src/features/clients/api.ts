import { apiClient, unwrapList } from "../../lib/api/client";
import { Client } from "../../types/domain";
import { PaginatedResult } from "../../types/api";

export type ClientPayload = {
  companyName: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  industry?: string;
  city?: string;
  country?: string;
  status?: Client["status"];
  annualRevenue?: number;
  ownerId: string;
};

export type ClientListParams = {
  page: number;
  pageSize: number;
  search?: string;
  status?: Client["status"];
  ownerId?: string;
};

export const clientsApi = {
  async list(params: ClientListParams): Promise<PaginatedResult<Client>> {
    const response = await apiClient.get<Client[]>("/clients", params);
    return unwrapList(response);
  },
  async getById(id: string) {
    const response = await apiClient.get<Client>(`/clients/${id}`);
    return response.data;
  },
  async create(payload: ClientPayload) {
    const response = await apiClient.post<Client>("/clients", payload);
    return response.data;
  },
  async update(id: string, payload: Partial<ClientPayload>) {
    const response = await apiClient.patch<Client>(`/clients/${id}`, payload);
    return response.data;
  },
  async remove(id: string) {
    await apiClient.delete(`/clients/${id}`);
  }
};
