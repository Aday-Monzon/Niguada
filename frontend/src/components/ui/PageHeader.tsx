import { PropsWithChildren, ReactNode } from "react";

type PageHeaderProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}>;

export const PageHeader = ({
  eyebrow,
  title,
  description,
  action,
  children
}: PageHeaderProps) => {
  return (
    <div className="page-header">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-accent-600">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-slate-900">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">{description}</p> : null}
        {children}
      </div>
      {action}
    </div>
  );
};
