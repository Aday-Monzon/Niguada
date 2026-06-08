import { LoginForm } from "../features/auth/components/LoginForm";

export const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-sm md:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-base font-bold text-white shadow-sm">
            N
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Niguada CRM</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-normal text-slate-950">
            Bienvenido de nuevo
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Accede a tu espacio comercial para gestionar clientes, oportunidades y tareas.
          </p>
        </div>

        <LoginForm />
      </section>
    </div>
  );
};
