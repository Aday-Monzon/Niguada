import {
  useQuery,
} from "@tanstack/react-query";
import { tasksApi, TaskListParams, TaskPayload } from "./api";
import { useFeedbackMutation } from "../../lib/query/useFeedbackMutation";

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
  return useFeedbackMutation({
    mutationFn: (payload: TaskPayload) => tasksApi.create(payload),
    successMessage: "Tarea creada correctamente",
    errorMessage: "Error al crear tarea",
    invalidateQueryKeys: [taskKeys.all]
  });
};

export const useUpdateTask = () => {
  return useFeedbackMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TaskPayload> }) =>
      tasksApi.update(id, payload),
    successMessage: "Tarea actualizada correctamente",
    errorMessage: "Error al actualizar tarea",
    invalidateQueryKeys: [taskKeys.all],
    onSuccess: ({ data, queryClient }) => {
      queryClient.setQueryData(taskKeys.detail(data.id), data);
    }
  });
};

export const useDeleteTask = () => {
  return useFeedbackMutation({
    mutationFn: (id: string) => tasksApi.remove(id),
    successMessage: "Tarea eliminada correctamente",
    errorMessage: "Error al eliminar tarea",
    invalidateQueryKeys: [taskKeys.all],
    onSuccess: ({ variables, queryClient }) => {
      queryClient.removeQueries({ queryKey: taskKeys.detail(variables) });
    }
  });
};
