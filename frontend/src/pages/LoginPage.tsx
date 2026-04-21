import { LoginForm } from "../features/auth/components/LoginForm";

export const LoginPage = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(28,126,214,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.16),_transparent_28%)]" />
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="hidden rounded-[2rem] border border-white/40 bg-slate-950 p-10 text-white shadow-panel lg:block">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Niguada CRM</p>
          <h1 className="mt-5 max-w-xl font-display text-5xl font-bold leading-tight">
            Control comercial y operativo con una interfaz sobria y lista para portfolio.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-8 text-slate-300">
            Visualiza pipeline, organiza clientes y mantén tareas críticas bajo control desde una sola vista.
          </p>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              ["Pipeline", "Seguimiento claro de oportunidades activas."],
              ["Clientes", "Contexto comercial sin pantallas recargadas."],
              ["Tareas", "Prioridades visibles y vencimientos a tiempo."]
            ].map(([title, copy]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel mx-auto w-full max-w-lg p-8 md:p-10">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.35em] text-accent-600">Acceso seguro</p>
            <h2 className="mt-3 font-display text-4xl font-bold text-slate-900">Bienvenido de nuevo</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Entra con una cuenta del backend ya sembrado. La sesión queda persistida entre recargas.
            </p>
          </div>
          <LoginForm />
        </section>
      </div>
    </div>
  );
};
