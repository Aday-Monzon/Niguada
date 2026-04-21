type MetricCardProps = {
  label: string;
  value: string;
  hint: string;
  tone?: "dark" | "light";
};

export const MetricCard = ({ label, value, hint, tone = "light" }: MetricCardProps) => {
  if (tone === "dark") {
    return (
      <article className="glass-panel bg-slate-950 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{label}</p>
        <p className="mt-4 font-display text-4xl font-bold">{value}</p>
        <p className="mt-4 text-sm text-slate-400">{hint}</p>
      </article>
    );
  }

  return (
    <article className="glass-panel">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <p className="mt-4 font-display text-4xl font-bold text-slate-900">{value}</p>
      <p className="mt-4 text-sm text-slate-500">{hint}</p>
    </article>
  );
};
