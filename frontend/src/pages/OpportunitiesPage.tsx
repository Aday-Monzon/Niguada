import { useEffect, useMemo, useState } from "react";
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
import { clientsApi } from "../features/clients/api";
import {
  OpportunityForm,
  OpportunityFormValues
} from "../features/opportunities/components/OpportunityForm";
import { opportunitiesApi } from "../features/opportunities/api";
import { ApiError } from "../lib/api/client";
import { humanizeStatus, opportunityToneMap } from "../lib/constants/status";
import { emptyToUndefined } from "../lib/utils/forms";
import { formatCurrency, formatDate } from "../lib/utils/format";
import { Client, Opportunity } from "../types/domain";

export const OpportunitiesPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Opportunity[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  const loadBaseData = async () => {
    const clientsResult = await clientsApi.list({ page: 1, pageSize: 100 });
    setClients(clientsResult.items);
  };

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await opportunitiesApi.list({
        page,
        pageSize: 8,
        search,
        stage: stage || undefined
      });

      setItems(result.items);
      setPageCount(result.meta?.pageCount ?? 1);
    } catch (error) {
      setError(error instanceof ApiError ? error.message : "No se pudieron cargar las oportunidades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBaseData();
  }, []);

  useEffect(() => {
    loadOpportunities();
  }, [page, search, stage]);

  const handleSubmit = async (values: OpportunityFormValues) => {
    const payload = emptyToUndefined(values);

    if (selectedOpportunity) {
      await opportunitiesApi.update(selectedOpportunity.id, payload);
    } else {
      await opportunitiesApi.create(payload);
    }

    setModalOpen(false);
    setSelectedOpportunity(null);
    await loadOpportunities();
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
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedOpportunity(item);
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
    const pipelineValue = items.reduce((total, item) => total + Number(item.estimatedValue), 0);
    const negotiationCount = items.filter((item) => item.stage === "NEGOTIATION").length;
    const avgProbability = items.length
      ? Math.round(items.reduce((total, item) => total + item.probability, 0) / items.length)
      : 0;

    return [
      { label: "Oportunidades", value: String(items.length), hint: "Items visibles en esta pagina" },
      { label: "Pipeline visible", value: formatCurrency(pipelineValue), hint: `${negotiationCount} en negociacion` },
      { label: "Probabilidad media", value: `${avgProbability}%`, hint: "Lectura rapida del embudo" }
    ];
  }, [items]);

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
              setStage(event.target.value);
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

      {loading ? (
        <Spinner />
      ) : error ? (
        <EmptyState title="No pudimos cargar oportunidades" description={error} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No hay oportunidades para mostrar"
          description="Cuando el pipeline empiece a moverse, las veras aparecer aqui."
        />
      ) : (
        <Card className="space-y-5">
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
    </div>
  );
};
