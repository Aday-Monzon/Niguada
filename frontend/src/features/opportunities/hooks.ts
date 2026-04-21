import {
  useQuery,
} from "@tanstack/react-query";
import {
  opportunitiesApi,
  OpportunityListParams,
  OpportunityPayload
} from "./api";
import { useFeedbackMutation } from "../../lib/query/useFeedbackMutation";

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
  return useFeedbackMutation({
    mutationFn: (payload: OpportunityPayload) => opportunitiesApi.create(payload),
    successMessage: "Oportunidad creada correctamente",
    errorMessage: "Error al crear oportunidad",
    invalidateQueryKeys: [opportunityKeys.all]
  });
};

export const useUpdateOpportunity = () => {
  return useFeedbackMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<OpportunityPayload> }) =>
      opportunitiesApi.update(id, payload),
    successMessage: "Oportunidad actualizada correctamente",
    errorMessage: "Error al actualizar oportunidad",
    invalidateQueryKeys: [opportunityKeys.all],
    onSuccess: ({ data, queryClient }) => {
      queryClient.setQueryData(opportunityKeys.detail(data.id), data);
    }
  });
};

export const useDeleteOpportunity = () => {
  return useFeedbackMutation({
    mutationFn: (id: string) => opportunitiesApi.remove(id),
    successMessage: "Oportunidad eliminada correctamente",
    errorMessage: "Error al eliminar oportunidad",
    invalidateQueryKeys: [opportunityKeys.all],
    onSuccess: ({ variables, queryClient }) => {
      queryClient.removeQueries({ queryKey: opportunityKeys.detail(variables) });
    }
  });
};
