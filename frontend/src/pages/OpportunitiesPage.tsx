import { useMemo, useState } from "react";
import { useAuth } from "../app/providers/AuthProvider";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
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
import {
  OpportunityForm,
  OpportunityFormValues
} from "../features/opportunities/components/OpportunityForm";
import {
  useCreateOpportunity,
  useDeleteOpportunity,
  useOpportunities,
  useUpdateOpportunity
} from "../features/opportunities/hooks";
import { humanizeStatus, opportunityToneMap } from "../lib/constants/status";
import { emptyToUndefined } from "../lib/utils/forms";
import { formatCurrency, formatDate } from "../lib/utils/format";
import { Opportunity } from "../types/domain";

const PAGE_SIZE = 8;
const REFERENCE_PAGE_SIZE = 100;

export const OpportunitiesPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<Opportunity["stage"] | "">("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [opportunityPendingDelete, setOpportunityPendingDelete] = useState<Opportunity | null>(null);

  const opportunitiesQuery = useOpportunities({
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
    stage: stage || undefined
  });
  const clientsQuery = useClients({ page: 1, pageSize: REFERENCE_PAGE_SIZE });
  const createOpportunity = useCreateOpportunity();
  const updateOpportunity = useUpdateOpportunity();
  const deleteOpportunity = useDeleteOpportunity();

  const items = opportunitiesQuery.data?.items ?? [];
  const pageCount = opportunitiesQuery.data?.meta?.pageCount ?? 1;
  const clients = clientsQuery.data?.items ?? [];

  const handleSubmit = async (values: OpportunityFormValues) => {
    const payload = emptyToUndefined(values);

    if (selectedOpportunity) {
      await updateOpportunity.mutateAsync({
        id: selectedOpportunity.id,
        payload
      });
    } else {
      await createOpportunity.mutateAsync(payload);
    }

    setModalOpen(false);
    setSelectedOpportunity(null);
  };

  const handleDelete = async () => {
    if (!opportunityPendingDelete) {
      return;
    }

    await deleteOpportunity.mutateAsync(opportunityPendingDelete.id);
    setOpportunityPendingDelete(null);
  };

  const columns = useMemo(
    () => [
      {
        key: "title",
        header: "Oportunidad",
        render: (item: Opportunity) => (
          <div>
            <p className="font-semibold text-slate-900">{item.title}</p>
            <p className="text-xs text-slate-500">{item.client.companyName}</p>
          </div>
        )
      },
      {
        key: "stage",
        header: "Fase",
        render: (item: Opportunity) => (
          <StatusBadge tone={opportunityToneMap[item.stage]} label={humanizeStatus(item.stage)} />
        )
      },
      {
        key: "value",
        header: "Valor",
        render: (item: Opportunity) => (
          <div>
            <p className="font-semibold text-slate-900">{formatCurrency(item.estimatedValue)}</p>
            <p className="text-xs text-slate-500">{item.probability}% probabilidad</p>
          </div>
        )
      },
      {
        key: "close",
        header: "Cierre esperado",
        render: (item: Opportunity) => <span>{formatDate(item.expectedCloseDate)}</span>
      },
      {
        key: "actions",
        header: "",
        className: "text-right",
        render: (item: Opportunity) => (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedOpportunity(item);
                setModalOpen(true);
              }}
            >
              Editar
            </Button>
            <Button
              variant="danger"
              busy={deleteOpportunity.isLoading && deleteOpportunity.variables === item.id}
              busyLabel="Eliminando..."
              onClick={() => {
                setOpportunityPendingDelete(item);
              }}
            >
              Eliminar
            </Button>
          </div>
        )
      }
    ],
    [deleteOpportunity.isLoading, deleteOpportunity.variables]
  );

  const metrics = useMemo(() => {
    const pipelineValue = items.reduce((total, item) => total + Number(item.estimatedValue), 0);
    const negotiationCount = items.filter((item) => item.stage === "NEGOTIATION").length;
    const avgProbability = items.length
      ? Math.round(items.reduce((total, item) => total + item.probability, 0) / items.length)
      : 0;

    return [
      {
        label: "Oportunidades",
        value: String(items.length),
        hint: opportunitiesQuery.isFetching ? "Actualizando pipeline" : "Items visibles en esta pagina"
      },
      { label: "Pipeline visible", value: formatCurrency(pipelineValue), hint: `${negotiationCount} en negociacion` },
      { label: "Probabilidad media", value: `${avgProbability}%`, hint: "Lectura rapida del embudo" }
    ];
  }, [items, opportunitiesQuery.isFetching]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pipeline"
        title="Oportunidades con contexto y foco"
        description="Un pipeline compacto, legible y orientado a mostrar criterio de producto y de negocio en portfolio."
        action={
          <Button
            onClick={() => {
              setSelectedOpportunity(null);
              setModalOpen(true);
            }}
          >
            Nueva oportunidad
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
            value={stage}
            onChange={(event) => {
              setPage(1);
              setStage(event.target.value as Opportunity["stage"] | "");
            }}
          >
            <option value="">Todas las fases</option>
            <option value="LEAD">Lead</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="PROPOSAL">Proposal</option>
            <option value="NEGOTIATION">Negotiation</option>
            <option value="WON">Won</option>
            <option value="LOST">Lost</option>
          </Select>
        </div>
      </Card>

      {opportunitiesQuery.isLoading || clientsQuery.isLoading ? (
        <Spinner />
      ) : opportunitiesQuery.isError || clientsQuery.isError ? (
        <EmptyState
          title="No pudimos cargar oportunidades"
          description={
            opportunitiesQuery.error instanceof Error
              ? opportunitiesQuery.error.message
              : clientsQuery.error instanceof Error
                ? clientsQuery.error.message
                : "Ha ocurrido un error inesperado"
          }
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="No hay oportunidades para mostrar"
          description="Cuando el pipeline empiece a moverse, las veras aparecer aqui."
        />
      ) : (
        <Card className="space-y-5">
          {opportunitiesQuery.isFetching ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Actualizando pipeline...
            </div>
          ) : null}
          <Table columns={columns} data={items} rowKey={(item) => item.id} />
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </Card>
      )}

      <Modal
        open={modalOpen}
        title={selectedOpportunity ? "Editar oportunidad" : "Nueva oportunidad"}
        onClose={() => {
          setModalOpen(false);
          setSelectedOpportunity(null);
        }}
      >
        <OpportunityForm
          clients={clients}
          ownerId={user!.id}
          initialValues={selectedOpportunity ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setSelectedOpportunity(null);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(opportunityPendingDelete)}
        title="Eliminar oportunidad"
        description={
          opportunityPendingDelete
            ? `Vas a eliminar ${opportunityPendingDelete.title}. Esta accion no se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar oportunidad"
        busy={deleteOpportunity.isLoading}
        onClose={() => {
          if (!deleteOpportunity.isLoading) {
            setOpportunityPendingDelete(null);
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
};
