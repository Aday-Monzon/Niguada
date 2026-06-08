type MetricCardProps = {
  label: string;
  value: string;
  hint: string;
  tone?: "dark" | "light";
};

export const MetricCard = ({ label, value, hint, tone = "light" }: MetricCardProps) => {
  if (tone === "dark") {
    return (
      <article className="min-w-0 overflow-hidden rounded-xl border border-slate-900 bg-slate-950 px-7 py-6 text-white shadow-sm sm:px-8">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-4 break-words text-2xl font-bold text-white">{value}</p>
        <p className="mt-2 break-words text-sm text-slate-400">{hint}</p>
      </article>
    );
  }

  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-zinc-200/80 bg-white px-7 py-6 shadow-sm sm:px-8">
      <p className="truncate text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-4 break-words text-2xl font-bold text-zinc-900">{value}</p>
      <p className="mt-2 break-words text-sm text-zinc-500">{hint}</p>
    </article>
  );
};
