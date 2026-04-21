import { toast } from "sonner";
import { ApiError } from "../api/client";

const normalizeMessage = (message: string) => message.trim().replace(/\.$/, "");

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError) {
    return normalizeMessage(error.message || fallback);
  }

  if (error instanceof Error) {
    return normalizeMessage(error.message || fallback);
  }

  return normalizeMessage(fallback);
};

export const notifySuccess = (title: string, description?: string) => {
  toast.success(normalizeMessage(title), {
    description
  });
};

export const notifyError = (title: string, error: unknown, fallbackDescription?: string) => {
  toast.error(normalizeMessage(title), {
    description: getErrorMessage(error, fallbackDescription ?? "Ha ocurrido un error inesperado")
  });
};
