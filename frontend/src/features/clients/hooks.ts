import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import { clientsApi, ClientListParams, ClientPayload } from "./api";

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ClientPayload) => clientsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
    }
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ClientPayload> }) =>
      clientsApi.update(id, payload),
    onSuccess: (client) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
      queryClient.setQueryData(clientKeys.detail(client.id), client);
    }
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientsApi.remove(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
      queryClient.removeQueries({ queryKey: clientKeys.detail(id) });
    }
  });
};
