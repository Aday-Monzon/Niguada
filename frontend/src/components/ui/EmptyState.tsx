type EmptyStateProps = {
  title: string;
  description: string;
};

export const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <div className="glass-panel flex min-h-[240px] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 rounded-3xl bg-accent-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent-600">
        Sin resultados
      </div>
      <h3 className="font-display text-2xl font-bold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  );
};
