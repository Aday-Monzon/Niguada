import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../../../app/providers/AuthProvider";
import { ApiError } from "../../../lib/api/client";
import { authApi } from "../api";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { FormField } from "../../../components/forms/FormField";

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
      email: "admin@niguada.dev",
      password: "Admin123!"
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
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Email" error={errors.email?.message}>
        <Input type="email" placeholder="tu@empresa.com" {...register("email")} />
      </FormField>
      <FormField label="Contraseña" error={errors.password?.message}>
        <Input type="password" placeholder="••••••••" {...register("password")} />
      </FormField>
      {errorMessage ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {errorMessage}
        </div>
      ) : null}
      <Button type="submit" className="w-full" busy={isSubmitting}>
        Entrar al CRM
      </Button>
    </form>
  );
};
