import {
  useQuery,
} from "@tanstack/react-query";
import { clientsApi, ClientListParams, ClientPayload } from "./api";
import { useFeedbackMutation } from "../../lib/query/useFeedbackMutation";

export const clientKeys = {
  all: ["clients"] as const,
  lists: () => [...clientKeys.all, "list"] as const,
  list: (params: ClientListParams) => [...clientKeys.lists(), params] as const,
  details: () => [...clientKeys.all, "detail"] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const
};

export const useClients = (params: ClientListParams) => {
  return useQuery({
    queryKey: clientKeys.list(params),
    queryFn: () => clientsApi.list(params),
    keepPreviousData: true
  });
};

export const useClient = (id?: string) => {
  return useQuery({
    queryKey: id ? clientKeys.detail(id) : clientKeys.details(),
    queryFn: () => clientsApi.getById(id!),
    enabled: Boolean(id)
  });
};

export const useCreateClient = () => {
  return useFeedbackMutation({
    mutationFn: (payload: ClientPayload) => clientsApi.create(payload),
    successMessage: "Cliente creado correctamente",
    errorMessage: "Error al crear cliente",
    invalidateQueryKeys: [clientKeys.all]
  });
};

export const useUpdateClient = () => {
  return useFeedbackMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ClientPayload> }) =>
      clientsApi.update(id, payload),
    successMessage: "Cliente actualizado correctamente",
    errorMessage: "Error al actualizar cliente",
    invalidateQueryKeys: [clientKeys.all],
    onSuccess: ({ data, queryClient }) => {
      queryClient.setQueryData(clientKeys.detail(data.id), data);
    }
  });
};

export const useDeleteClient = () => {
  return useFeedbackMutation({
    mutationFn: (id: string) => clientsApi.remove(id),
    successMessage: "Cliente eliminado correctamente",
    errorMessage: "Error al eliminar cliente",
    invalidateQueryKeys: [clientKeys.all],
    onSuccess: ({ variables, queryClient }) => {
      queryClient.removeQueries({ queryKey: clientKeys.detail(variables) });
    }
  });
};
