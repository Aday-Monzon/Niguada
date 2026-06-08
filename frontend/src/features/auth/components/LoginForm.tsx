import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../../../app/providers/AuthProvider";
import { FormField } from "../../../components/forms/FormField";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { ApiError } from "../../../lib/api/client";
import { authApi } from "../api";

const loginSchema = z.object({
  email: z.string().email("Introduce un email valido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
});

type LoginValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      setErrorMessage(null);
      const response = await authApi.login(values);
      await login(response.data);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : "No se pudo iniciar sesión");
    }
  };

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <FormField label="Email" error={errors.email?.message}>
          <Input
            type="email"
            placeholder="tu@empresa.com"
            className="h-11 rounded-xl border-zinc-200 bg-zinc-50/70 px-3.5 text-[15px] shadow-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-zinc-100"
            {...register("email")}
          />
        </FormField>

        <FormField label="Contraseña" error={errors.password?.message}>
          <Input
            type="password"
            placeholder="********"
            className="h-11 rounded-xl border-zinc-200 bg-zinc-50/70 px-3.5 text-[15px] shadow-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-zinc-100"
            {...register("password")}
          />
        </FormField>
      </div>

      {errorMessage ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          {errorMessage}
        </div>
      ) : null}

      <Button
        type="submit"
        className="h-11 w-full rounded-xl bg-slate-950 text-sm font-semibold shadow-sm hover:bg-slate-800"
        busy={isSubmitting}
        busyLabel="Entrando..."
      >
        Entrar al CRM
      </Button>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <span className="w-full border-t border-zinc-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">o</span>
        </div>
      </div>

      <button
        type="button"
        className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-zinc-50"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-200 bg-white text-xs font-bold text-slate-900">
          G
        </span>
        Continuar con Google
      </button>
    </form>
  );
};
