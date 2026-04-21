import { PropsWithChildren, ReactNode } from "react";

type FormFieldProps = PropsWithChildren<{
  label: string;
  error?: string;
  hint?: ReactNode;
}>;

export const FormField = ({ label, error, hint, children }: FormFieldProps) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {hint ? <span className="mt-2 block text-xs text-slate-400">{hint}</span> : null}
      {error ? <span className="mt-2 block text-xs font-semibold text-rose-500">{error}</span> : null}
    </label>
  );
};
