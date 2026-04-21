import { useEffect, useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Spinner } from "../components/ui/Spinner";
import { StatusBadge } from "../components/ui/StatusBadge";
import { clientsApi } from "../features/clients/api";
import { opportunitiesApi } from "../features/opportunities/api";
import { tasksApi } from "../features/tasks/api";
import { ApiError } from "../lib/api/client";
import { formatCurrency, formatDate } from "../lib/utils/format";
import { Client, Opportunity, Task } from "../types/domain";

export const DashboardPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const [clientsResponse, opportunitiesResponse, tasksResponse] = await Promise.all([
          clientsApi.list({ page: 1, pageSize: 5 }),
          opportunitiesApi.list({ page: 1, pageSize: 5 }),
          tasksApi.list({ page: 1, pageSize: 5 })
        ]);

        setClients(clientsResponse.items);
        setOpportunities(opportunitiesResponse.items);
        setTasks(tasksResponse.items);
      } catch (error) {
        setError(error instanceof ApiError ? error.message : "No se pudo cargar el dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const metrics = useMemo(() => {
    const pipelineValue = opportunities.reduce(
      (total, item) => total + Number(item.estimatedValue),
      0
    );
    const openTasks = tasks.filter((task) => task.status !== "DONE").length;
    const activeClients = clients.filter((client) => client.status === "ACTIVE").length;

    return [
      {
        label: "Pipeline actual",
        value: formatCurrency(pipelineValue),
        tone: "Desde oportunidades recientes"
      },
      {
        label: "Clientes activos",
        value: String(activeClients),
        tone: "Base comercial viva"
      },
      {
        label: "Tareas abiertas",
        value: String(openTasks),
        tone: "Seguimiento pendiente"
      }
    ];
  }, [clients, opportunities, tasks]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <EmptyState
        title="No pudimos cargar el dashboard"
        description={error}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-accent-600">Vision general</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-slate-900">
            Un resumen claro del pulso comercial
          </h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((item) => (
          <Card key={item.label} className="bg-slate-950 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
            <p className="mt-4 font-display text-4xl font-bold">{item.value}</p>
            <p className="mt-4 text-sm text-slate-400">{item.tone}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Oportunidades recientes</h2>
            <span className="text-sm text-slate-400">{opportunities.length} visibles</span>
          </div>
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{opportunity.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{opportunity.client.companyName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">
                      {formatCurrency(opportunity.estimatedValue)}
                    </p>
                    <p className="text-sm text-slate-500">{opportunity.probability}% probabilidad</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <StatusBadge
                    tone={mapOpportunityTone(opportunity.stage)}
                    label={opportunity.stage.replace("_", " ")}
                  />
                  <span className="text-sm text-slate-400">
                    Cierre {formatDate(opportunity.expectedCloseDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">Tareas prioritarias</h2>
              <span className="text-sm text-slate-400">{tasks.length} visibles</span>
            </div>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="rounded-3xl border border-slate-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{task.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {task.client?.companyName ?? "Sin cliente"} · {task.assignee.firstName}
                      </p>
                    </div>
                    <StatusBadge tone={mapTaskPriorityTone(task.priority)} label={task.priority} />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <StatusBadge tone={mapTaskStatusTone(task.status)} label={task.status} />
                    <span className="text-sm text-slate-400">{formatDate(task.dueDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-accent-500 to-accent-700 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">Base de clientes</p>
            <p className="mt-4 font-display text-3xl font-bold">{clients.length} registros recientes</p>
            <div className="mt-6 space-y-3">
              {clients.map((client) => (
                <div key={client.id} className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <div>
                    <p className="font-semibold">{client.companyName}</p>
                    <p className="text-sm text-white/70">{client.contactEmail || "Sin email"}</p>
                  </div>
                  <StatusBadge tone={mapClientTone(client.status)} label={client.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const mapClientTone = (status: Client["status"]) => {
  return (
    {
      LEAD: "lead",
      ACTIVE: "active",
      INACTIVE: "inactive"
    }[status] as "lead" | "active" | "inactive"
  );
};

const mapOpportunityTone = (stage: Opportunity["stage"]) => {
  return (
    {
      LEAD: "lead",
      QUALIFIED: "qualified",
      PROPOSAL: "proposal",
      NEGOTIATION: "negotiation",
      WON: "won",
      LOST: "lost"
    }[stage] as "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost"
  );
};

const mapTaskStatusTone = (status: Task["status"]) => {
  return (
    {
      TODO: "todo",
      IN_PROGRESS: "progress",
      DONE: "done",
      CANCELED: "canceled"
    }[status] as "todo" | "progress" | "done" | "canceled"
  );
};

const mapTaskPriorityTone = (priority: Task["priority"]) => {
  return (
    {
      LOW: "low",
      MEDIUM: "medium",
      HIGH: "high",
      URGENT: "urgent"
    }[priority] as "low" | "medium" | "high" | "urgent"
  );
};
