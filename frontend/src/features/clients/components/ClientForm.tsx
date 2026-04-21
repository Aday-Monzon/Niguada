import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "../../../components/forms/FormField";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Client } from "../../../types/domain";

const clientSchema = z.object({
  companyName: z.string().min(2, "Introduce un nombre de empresa"),
  contactName: z.string().optional(),
  contactEmail: z.string().email("Email no valido").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  industry: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  status: z.enum(["LEAD", "ACTIVE", "INACTIVE"]),
  annualRevenue: z.preprocess(
    (value) => (value === "" || value === undefined ? undefined : Number(value)),
    z.number().nonnegative().optional()
  ),
  ownerId: z.string().min(1)
});

export type ClientFormValues = z.infer<typeof clientSchema>;

type ClientFormProps = {
  initialValues?: Partial<Client>;
  ownerId: string;
  onSubmit: (values: ClientFormValues) => Promise<void>;
  onCancel: () => void;
};

export const ClientForm = ({ initialValues, ownerId, onSubmit, onCancel }: ClientFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      companyName: initialValues?.companyName ?? "",
      contactName: initialValues?.contactName ?? "",
      contactEmail: initialValues?.contactEmail ?? "",
      contactPhone: initialValues?.contactPhone ?? "",
      industry: initialValues?.industry ?? "",
      city: initialValues?.city ?? "",
      country: initialValues?.country ?? "",
      status: initialValues?.status ?? "LEAD",
      annualRevenue: initialValues?.annualRevenue ? Number(initialValues.annualRevenue) : undefined,
      ownerId
    }
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Empresa" error={errors.companyName?.message}>
          <Input {...register("companyName")} placeholder="Acme Logistics" />
        </FormField>
        <FormField label="Contacto" error={errors.contactName?.message}>
          <Input {...register("contactName")} placeholder="Laura Diaz" />
        </FormField>
        <FormField label="Email" error={errors.contactEmail?.message}>
          <Input {...register("contactEmail")} placeholder="laura@empresa.com" />
        </FormField>
        <FormField label="Telefono" error={errors.contactPhone?.message}>
          <Input {...register("contactPhone")} placeholder="+34 600 123 456" />
        </FormField>
        <FormField label="Industria" error={errors.industry?.message}>
          <Input {...register("industry")} placeholder="Logistics" />
        </FormField>
        <FormField label="Estado" error={errors.status?.message}>
          <Select {...register("status")}>
            <option value="LEAD">Lead</option>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </Select>
        </FormField>
        <FormField label="Ciudad" error={errors.city?.message}>
          <Input {...register("city")} placeholder="Las Palmas" />
        </FormField>
        <FormField label="Pais" error={errors.country?.message}>
          <Input {...register("country")} placeholder="Spain" />
        </FormField>
        <FormField label="Facturacion anual" error={errors.annualRevenue?.message}>
          <Input type="number" step="1" {...register("annualRevenue")} placeholder="180000" />
        </FormField>
      </div>

      <div className="flex justify-end gap-3 pt-3">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          type="submit"
          busy={isSubmitting}
          busyLabel={initialValues?.id ? "Actualizando cliente..." : "Creando cliente..."}
        >
          {initialValues?.id ? "Actualizar cliente" : "Crear cliente"}
        </Button>
      </div>
    </form>
  );
};
