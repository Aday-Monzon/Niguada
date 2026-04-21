import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "../../../components/forms/FormField";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Client, Opportunity } from "../../../types/domain";

const opportunitySchema = z.object({
  title: z.string().min(2, "Introduce un titulo"),
  description: z.string().optional(),
  stage: z.enum(["LEAD", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"]),
  estimatedValue: z.preprocess((value) => Number(value), z.number().nonnegative()),
  probability: z.preprocess((value) => Number(value), z.number().min(0).max(100)),
  expectedCloseDate: z.string().optional(),
  lostReason: z.string().optional(),
  clientId: z.string().min(1, "Selecciona un cliente"),
  ownerId: z.string().min(1)
});

export type OpportunityFormValues = z.infer<typeof opportunitySchema>;

type OpportunityFormProps = {
  clients: Client[];
  ownerId: string;
  initialValues?: Partial<Opportunity>;
  onSubmit: (values: OpportunityFormValues) => Promise<void>;
  onCancel: () => void;
};

export const OpportunityForm = ({
  clients,
  ownerId,
  initialValues,
  onSubmit,
  onCancel
}: OpportunityFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      stage: initialValues?.stage ?? "LEAD",
      estimatedValue: initialValues?.estimatedValue ? Number(initialValues.estimatedValue) : 0,
      probability: initialValues?.probability ?? 10,
      expectedCloseDate: initialValues?.expectedCloseDate?.slice(0, 10) ?? "",
      lostReason: initialValues?.lostReason ?? "",
      clientId: initialValues?.clientId ?? "",
      ownerId
    }
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Titulo" error={errors.title?.message}>
          <Input {...register("title")} placeholder="CRM rollout Q3" />
        </FormField>
        <FormField label="Cliente" error={errors.clientId?.message}>
          <Select {...register("clientId")}>
            <option value="">Selecciona un cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.companyName}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Fase" error={errors.stage?.message}>
          <Select {...register("stage")}>
            <option value="LEAD">Lead</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="PROPOSAL">Proposal</option>
            <option value="NEGOTIATION">Negotiation</option>
            <option value="WON">Won</option>
            <option value="LOST">Lost</option>
          </Select>
        </FormField>
        <FormField label="Valor estimado" error={errors.estimatedValue?.message}>
          <Input type="number" {...register("estimatedValue")} placeholder="18000" />
        </FormField>
        <FormField label="Probabilidad" error={errors.probability?.message}>
          <Input type="number" {...register("probability")} placeholder="70" />
        </FormField>
        <FormField label="Cierre esperado" error={errors.expectedCloseDate?.message}>
          <Input type="date" {...register("expectedCloseDate")} />
        </FormField>
      </div>
      <FormField label="Descripcion" error={errors.description?.message}>
        <Input {...register("description")} placeholder="Resumen comercial de la oportunidad" />
      </FormField>
      <FormField label="Motivo de perdida" error={errors.lostReason?.message}>
        <Input {...register("lostReason")} placeholder="Solo si aplica" />
      </FormField>
      <div className="flex justify-end gap-3 pt-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" busy={isSubmitting}>
          {initialValues?.id ? "Actualizar oportunidad" : "Crear oportunidad"}
        </Button>
      </div>
    </form>
  );
};
