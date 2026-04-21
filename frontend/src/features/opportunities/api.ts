import { apiClient, unwrapList } from "../../lib/api/client";
import { Opportunity } from "../../types/domain";

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

export const opportunitiesApi = {
  async list(params: Record<string, string | number | undefined>) {
    const response = await apiClient.get<Opportunity[]>("/opportunities", params);
    return unwrapList(response);
  },
  async create(payload: OpportunityPayload) {
    return apiClient.post<Opportunity>("/opportunities", payload);
  },
  async update(id: string, payload: Partial<OpportunityPayload>) {
    return apiClient.patch<Opportunity>(`/opportunities/${id}`, payload);
  }
};
