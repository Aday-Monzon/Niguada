import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import {
  opportunitiesApi,
  OpportunityListParams,
  OpportunityPayload
} from "./api";

export const opportunityKeys = {
  all: ["opportunities"] as const,
  lists: () => [...opportunityKeys.all, "list"] as const,
  list: (params: OpportunityListParams) => [...opportunityKeys.lists(), params] as const,
  details: () => [...opportunityKeys.all, "detail"] as const,
  detail: (id: string) => [...opportunityKeys.details(), id] as const
};

export const useOpportunities = (params: OpportunityListParams) =>
  useQuery({
    queryKey: opportunityKeys.list(params),
    queryFn: () => opportunitiesApi.list(params),
    keepPreviousData: true
  });

export const useOpportunity = (id?: string) =>
  useQuery({
    queryKey: id ? opportunityKeys.detail(id) : opportunityKeys.details(),
    queryFn: () => opportunitiesApi.getById(id!),
    enabled: Boolean(id)
  });

export const useCreateOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OpportunityPayload) => opportunitiesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
    }
  });
};

export const useUpdateOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<OpportunityPayload> }) =>
      opportunitiesApi.update(id, payload),
    onSuccess: (opportunity) => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
      queryClient.setQueryData(opportunityKeys.detail(opportunity.id), opportunity);
    }
  });
};

export const useDeleteOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => opportunitiesApi.remove(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
      queryClient.removeQueries({ queryKey: opportunityKeys.detail(id) });
    }
  });
};
