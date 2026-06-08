import { PropsWithChildren, ReactNode } from "react";

type FormFieldProps = PropsWithChildren<{
  label: string;
  error?: string;
  hint?: ReactNode;
}>;

export const FormField = ({ label, error, hint, children }: FormFieldProps) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-800">{label}</span>
      {children}
      {hint ? <span className="mt-2 block text-xs text-zinc-500">{hint}</span> : null}
      {error ? <span className="mt-2 block text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
};
