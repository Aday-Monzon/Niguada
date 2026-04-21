import {
  MutationFunction,
  QueryKey,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { notifyError, notifySuccess } from "../ui/toast";

type SuccessMessage<TData, TVariables> = string | ((data: TData, variables: TVariables) => string);
type ErrorMessage<TVariables> = string | ((variables: TVariables) => string);

type FeedbackMutationOptions<TData, TVariables> = {
  mutationFn: MutationFunction<TData, TVariables>;
  successMessage: SuccessMessage<TData, TVariables>;
  errorMessage: ErrorMessage<TVariables>;
  invalidateQueryKeys?: readonly QueryKey[];
  onSuccess?: (context: {
    data: TData;
    variables: TVariables;
    queryClient: ReturnType<typeof useQueryClient>;
  }) => void | Promise<void>;
};

const resolveSuccessMessage = <TData, TVariables>(
  successMessage: SuccessMessage<TData, TVariables>,
  data: TData,
  variables: TVariables
) => (typeof successMessage === "function" ? successMessage(data, variables) : successMessage);

const resolveErrorMessage = <TVariables>(
  errorMessage: ErrorMessage<TVariables>,
  variables: TVariables
) => (typeof errorMessage === "function" ? errorMessage(variables) : errorMessage);

export const useFeedbackMutation = <TData, TVariables>({
  mutationFn,
  successMessage,
  errorMessage,
  invalidateQueryKeys = [],
  onSuccess
}: FeedbackMutationOptions<TData, TVariables>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: async (data, variables) => {
      await Promise.all(
        invalidateQueryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey }))
      );

      if (onSuccess) {
        await onSuccess({
          data,
          variables,
          queryClient
        });
      }

      notifySuccess(resolveSuccessMessage(successMessage, data, variables));
    },
    onError: (error, variables) => {
      notifyError(resolveErrorMessage(errorMessage, variables), error);
    }
  });
};
