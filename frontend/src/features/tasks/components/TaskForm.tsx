import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "../../../components/forms/FormField";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Client, Opportunity, Task } from "../../../types/domain";

const taskSchema = z.object({
  title: z.string().min(2, "Introduce un titulo"),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  dueDate: z.string().optional(),
  clientId: z.string().optional(),
  opportunityId: z.string().optional(),
  assigneeId: z.string().min(1)
});

export type TaskFormValues = z.infer<typeof taskSchema>;

type TaskFormProps = {
  clients: Client[];
  opportunities: Opportunity[];
  assigneeId: string;
  initialValues?: Partial<Task>;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel: () => void;
};

export const TaskForm = ({
  clients,
  opportunities,
  assigneeId,
  initialValues,
  onSubmit,
  onCancel
}: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      status: initialValues?.status ?? "TODO",
      priority: initialValues?.priority ?? "MEDIUM",
      dueDate: initialValues?.dueDate?.slice(0, 10) ?? "",
      clientId: initialValues?.client?.id ?? "",
      opportunityId: initialValues?.opportunity?.id ?? "",
      assigneeId
    }
  });

  const selectedClientId = watch("clientId");
  const filteredOpportunities = selectedClientId
    ? opportunities.filter((opportunity) => opportunity.client.id === selectedClientId)
    : opportunities;

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Titulo" error={errors.title?.message}>
          <Input {...register("title")} placeholder="Preparar propuesta comercial" />
        </FormField>
        <FormField label="Fecha limite" error={errors.dueDate?.message}>
          <Input type="date" {...register("dueDate")} />
        </FormField>
        <FormField label="Estado" error={errors.status?.message}>
          <Select {...register("status")}>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">En progreso</option>
            <option value="DONE">Hecha</option>
            <option value="CANCELED">Cancelada</option>
          </Select>
        </FormField>
        <FormField label="Prioridad" error={errors.priority?.message}>
          <Select {...register("priority")}>
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="URGENT">Urgente</option>
          </Select>
        </FormField>
        <FormField label="Cliente" error={errors.clientId?.message}>
          <Select {...register("clientId")}>
            <option value="">Sin cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.companyName}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Oportunidad" error={errors.opportunityId?.message}>
          <Select {...register("opportunityId")}>
            <option value="">Sin oportunidad</option>
            {filteredOpportunities.map((opportunity) => (
              <option key={opportunity.id} value={opportunity.id}>
                {opportunity.title}
              </option>
            ))}
          </Select>
        </FormField>
      </div>
      <FormField label="Descripcion" error={errors.description?.message}>
        <Input {...register("description")} placeholder="Contexto rapido para el seguimiento" />
      </FormField>
      <div className="flex justify-end gap-3 pt-3">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          type="submit"
          busy={isSubmitting}
          busyLabel={initialValues?.id ? "Actualizando tarea..." : "Creando tarea..."}
        >
          {initialValues?.id ? "Actualizar tarea" : "Crear tarea"}
        </Button>
      </div>
    </form>
  );
};
