import { useMemo, useState } from "react";
import { useAuth } from "../app/providers/AuthProvider";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { MetricCard } from "../components/ui/MetricCard";
import { Modal } from "../components/ui/Modal";
import { Pagination } from "../components/ui/Pagination";
import { PageHeader } from "../components/ui/PageHeader";
import { Select } from "../components/ui/Select";
import { Spinner } from "../components/ui/Spinner";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Table } from "../components/ui/Table";
import { useClients } from "../features/clients/hooks";
import { useOpportunities } from "../features/opportunities/hooks";
import { TaskForm, TaskFormValues } from "../features/tasks/components/TaskForm";
import { useCreateTask, useTasks, useUpdateTask } from "../features/tasks/hooks";
import { taskPriorityToneMap, taskStatusToneMap } from "../lib/constants/status";
import { emptyToUndefined } from "../lib/utils/forms";
import { formatDate } from "../lib/utils/format";
import { Task } from "../types/domain";

const PAGE_SIZE = 8;
const REFERENCE_PAGE_SIZE = 100;

export const TasksPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Task["status"] | "">("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const tasksQuery = useTasks({
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
    status: status || undefined
  });
  const clientsQuery = useClients({ page: 1, pageSize: REFERENCE_PAGE_SIZE });
  const opportunitiesQuery = useOpportunities({ page: 1, pageSize: REFERENCE_PAGE_SIZE });
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const items = tasksQuery.data?.items ?? [];
  const pageCount = tasksQuery.data?.meta?.pageCount ?? 1;
  const clients = clientsQuery.data?.items ?? [];
  const opportunities = opportunitiesQuery.data?.items ?? [];

  const handleSubmit = async (values: TaskFormValues) => {
    const payload = emptyToUndefined(values);

    if (selectedTask) {
      await updateTask.mutateAsync({
        id: selectedTask.id,
        payload
      });
    } else {
      await createTask.mutateAsync(payload);
    }

    setModalOpen(false);
    setSelectedTask(null);
  };

  const columns = useMemo(
    () => [
      {
        key: "title",
        header: "Tarea",
        render: (item: Task) => (
          <div>
            <p className="font-semibold text-slate-900">{item.title}</p>
            <p className="text-xs text-slate-500">
              {item.client?.companyName ?? "Sin cliente"} | {item.assignee.firstName}
            </p>
          </div>
        )
      },
      {
        key: "status",
        header: "Estado",
        render: (item: Task) => <StatusBadge tone={taskStatusToneMap[item.status]} label={item.status} />
      },
      {
        key: "priority",
        header: "Prioridad",
        render: (item: Task) => <StatusBadge tone={taskPriorityToneMap[item.priority]} label={item.priority} />
      },
      {
        key: "dueDate",
        header: "Vence",
        render: (item: Task) => <span>{formatDate(item.dueDate)}</span>
      },
      {
        key: "actions",
        header: "",
        className: "text-right",
        render: (item: Task) => (
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedTask(item);
              setModalOpen(true);
            }}
          >
            Editar
          </Button>
        )
      }
    ],
    []
  );

  const metrics = useMemo(() => {
    const openItems = items.filter((item) => item.status !== "DONE").length;
    const urgentItems = items.filter((item) => item.priority === "URGENT").length;
    const dueSoon = items.filter((item) => {
      if (!item.dueDate) {
        return false;
      }

      return new Date(item.dueDate).getTime() - Date.now() <= 3 * 24 * 60 * 60 * 1000;
    }).length;

    return [
      {
        label: "Tareas visibles",
        value: String(items.length),
        hint: tasksQuery.isFetching ? "Actualizando seguimiento" : "Segmento actual de trabajo"
      },
      { label: "Pendientes", value: String(openItems), hint: `${urgentItems} urgentes` },
      { label: "Vencen pronto", value: String(dueSoon), hint: "Ventana de los proximos 3 dias" }
    ];
  }, [items, tasksQuery.isFetching]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Ejecucion"
        title="Tareas con prioridad visible"
        description="Seguimiento operativo limpio, con filtros sencillos y jerarquia visual suficiente para sentirse como un producto real."
        action={
          <Button
            onClick={() => {
              setSelectedTask(null);
              setModalOpen(true);
            }}
          >
            Nueva tarea
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <Input
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
            placeholder="Buscar por titulo o descripcion"
          />
          <Select
            value={status}
            onChange={(event) => {
              setPage(1);
              setStatus(event.target.value as Task["status"] | "");
            }}
          >
            <option value="">Todos los estados</option>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">En progreso</option>
            <option value="DONE">Hecha</option>
            <option value="CANCELED">Cancelada</option>
          </Select>
        </div>
      </Card>

      {tasksQuery.isLoading || clientsQuery.isLoading || opportunitiesQuery.isLoading ? (
        <Spinner />
      ) : tasksQuery.isError || clientsQuery.isError || opportunitiesQuery.isError ? (
        <EmptyState
          title="No pudimos cargar tareas"
          description={
            tasksQuery.error instanceof Error
              ? tasksQuery.error.message
              : clientsQuery.error instanceof Error
                ? clientsQuery.error.message
                : opportunitiesQuery.error instanceof Error
                  ? opportunitiesQuery.error.message
                  : "Ha ocurrido un error inesperado"
          }
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="No hay tareas con estos filtros"
          description="Puedes crear seguimiento operativo o comercial desde este mismo panel."
        />
      ) : (
        <Card className="space-y-5">
          {tasksQuery.isFetching ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Actualizando seguimiento...
            </div>
          ) : null}
          <Table columns={columns} data={items} rowKey={(item) => item.id} />
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </Card>
      )}

      <Modal
        open={modalOpen}
        title={selectedTask ? "Editar tarea" : "Nueva tarea"}
        onClose={() => {
          setModalOpen(false);
          setSelectedTask(null);
        }}
      >
        <TaskForm
          clients={clients}
          opportunities={opportunities}
          assigneeId={user!.id}
          initialValues={selectedTask ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setSelectedTask(null);
          }}
        />
      </Modal>
    </div>
  );
};
