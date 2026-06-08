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
  lead: "border-zinc-200 bg-zinc-50 text-zinc-700",
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  inactive: "border-zinc-200 bg-zinc-100/70 text-zinc-600",
  qualified: "border-sky-200 bg-sky-50 text-sky-700",
  proposal: "border-indigo-200 bg-indigo-50 text-indigo-700",
  negotiation: "border-amber-200 bg-amber-50 text-amber-700",
  won: "border-emerald-200 bg-emerald-50 text-emerald-700",
  lost: "border-rose-200 bg-rose-50 text-rose-700",
  todo: "border-zinc-200 bg-zinc-50 text-zinc-700",
  progress: "border-sky-200 bg-sky-50 text-sky-700",
  done: "border-emerald-200 bg-emerald-50 text-emerald-700",
  canceled: "border-rose-200 bg-rose-50 text-rose-700",
  low: "border-zinc-200 bg-zinc-50 text-zinc-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-orange-200 bg-orange-50 text-orange-700",
  urgent: "border-rose-200 bg-rose-50 text-rose-700"
};

export const StatusBadge = ({ tone, label }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium uppercase tracking-wide",
        palette[tone]
      )}
    >
      {label}
    </span>
  );
};
