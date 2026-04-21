import { cn } from "../../lib/utils/cn";

type StatusBadgeProps = {
  tone:
    | "lead"
    | "active"
    | "inactive"
    | "qualified"
    | "proposal"
    | "negotiation"
    | "won"
    | "lost"
    | "todo"
    | "progress"
    | "done"
    | "canceled"
    | "low"
    | "medium"
    | "high"
    | "urgent";
  label: string;
};

const palette: Record<StatusBadgeProps["tone"], string> = {
  lead: "bg-slate-100 text-slate-600",
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-200 text-slate-600",
  qualified: "bg-sky-100 text-sky-700",
  proposal: "bg-indigo-100 text-indigo-700",
  negotiation: "bg-amber-100 text-amber-700",
  won: "bg-emerald-100 text-emerald-700",
  lost: "bg-rose-100 text-rose-700",
  todo: "bg-slate-100 text-slate-600",
  progress: "bg-sky-100 text-sky-700",
  done: "bg-emerald-100 text-emerald-700",
  canceled: "bg-rose-100 text-rose-700",
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-rose-100 text-rose-700"
};

export const StatusBadge = ({ tone, label }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        palette[tone]
      )}
    >
      {label}
    </span>
  );
};
