import { apiClient, unwrapList } from "../../lib/api/client";
import { Opportunity } from "../../types/domain";
import { PaginatedResult } from "../../types/api";

export type OpportunityPayload = {
  title: string;
  description?: string;
  stage?: Opportunity["stage"];
  estimatedValue: number;
  probability?: number;
  expectedCloseDate?: string;
  lostReason?: string;
  clientId: string;
  ownerId: string;
};

export type OpportunityListParams = {
  page: number;
  pageSize: number;
  search?: string;
  stage?: Opportunity["stage"];
  clientId?: string;
  ownerId?: string;
};

export const opportunitiesApi = {
  async list(params: OpportunityListParams): Promise<PaginatedResult<Opportunity>> {
    const response = await apiClient.get<Opportunity[]>("/opportunities", params);
    return unwrapList(response);
  },
  async getById(id: string) {
    const response = await apiClient.get<Opportunity>(`/opportunities/${id}`);
    return response.data;
  },
  async create(payload: OpportunityPayload) {
    const response = await apiClient.post<Opportunity>("/opportunities", payload);
    return response.data;
  },
  async update(id: string, payload: Partial<OpportunityPayload>) {
    const response = await apiClient.patch<Opportunity>(`/opportunities/${id}`, payload);
    return response.data;
  },
  async remove(id: string) {
    await apiClient.delete(`/opportunities/${id}`);
  }
};
