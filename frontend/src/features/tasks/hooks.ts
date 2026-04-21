import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import { tasksApi, TaskListParams, TaskPayload } from "./api";

export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (params: TaskListParams) => [...taskKeys.lists(), params] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const
};

export const useTasks = (params: TaskListParams) =>
  useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => tasksApi.list(params),
    keepPreviousData: true
  });

export const useTask = (id?: string) =>
  useQuery({
    queryKey: id ? taskKeys.detail(id) : taskKeys.details(),
    queryFn: () => tasksApi.getById(id!),
    enabled: Boolean(id)
  });

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TaskPayload) => tasksApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    }
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TaskPayload> }) =>
      tasksApi.update(id, payload),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.setQueryData(taskKeys.detail(task.id), task);
    }
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApi.remove(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.removeQueries({ queryKey: taskKeys.detail(id) });
    }
  });
};
