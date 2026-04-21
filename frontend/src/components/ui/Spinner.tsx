export const Spinner = () => {
  return (
    <div className="inline-flex items-center gap-3 text-sm text-slate-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-accent-500" />
      Cargando...
    </div>
  );
};
