import { apiClient, unwrapList } from "../../lib/api/client";
import { Client } from "../../types/domain";

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

export const clientsApi = {
  async list(params: Record<string, string | number | undefined>) {
    const response = await apiClient.get<Client[]>("/clients", params);
    return unwrapList(response);
  },
  async create(payload: ClientPayload) {
    return apiClient.post<Client>("/clients", payload);
  },
  async update(id: string, payload: Partial<ClientPayload>) {
    return apiClient.patch<Client>(`/clients/${id}`, payload);
  }
};
