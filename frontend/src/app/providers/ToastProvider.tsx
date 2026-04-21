import { Toaster } from "sonner";

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast: "rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.35)]",
          title: "text-sm font-semibold text-slate-900",
          description: "text-sm text-slate-500",
          success: "border-emerald-200",
          error: "border-rose-200"
        }
      }}
    />
  );
};
