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
import { ClientForm, ClientFormValues } from "../features/clients/components/ClientForm";
import {
  useClients,
  useCreateClient,
  useUpdateClient
} from "../features/clients/hooks";
import { clientToneMap } from "../lib/constants/status";
import { emptyToUndefined } from "../lib/utils/forms";
import { formatCurrency } from "../lib/utils/format";
import { Client } from "../types/domain";

const PAGE_SIZE = 8;

export const ClientsPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Client["status"] | "">("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const clientsQuery = useClients({
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
    status: status || undefined
  });
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const items = clientsQuery.data?.items ?? [];
  const pageCount = clientsQuery.data?.meta?.pageCount ?? 1;

  const handleSubmit = async (values: ClientFormValues) => {
    const payload = emptyToUndefined(values);

    if (selectedClient) {
      await updateClient.mutateAsync({
        id: selectedClient.id,
        payload
      });
    } else {
      await createClient.mutateAsync(payload);
    }

    setModalOpen(false);
    setSelectedClient(null);
  };

  const columns = useMemo(
    () => [
      {
        key: "company",
        header: "Empresa",
        render: (item: Client) => (
          <div>
            <p className="font-semibold text-slate-900">{item.companyName}</p>
            <p className="text-xs text-slate-500">{item.industry ?? "Industria no definida"}</p>
          </div>
        )
      },
      {
        key: "contact",
        header: "Contacto",
        render: (item: Client) => (
          <div>
            <p>{item.contactName ?? "Sin contacto"}</p>
            <p className="text-xs text-slate-500">{item.contactEmail ?? "Sin email"}</p>
          </div>
        )
      },
      {
        key: "location",
        header: "Ubicacion",
        render: (item: Client) => <span>{[item.city, item.country].filter(Boolean).join(", ") || "N/D"}</span>
      },
      {
        key: "status",
        header: "Estado",
        render: (item: Client) => <StatusBadge tone={clientToneMap[item.status]} label={item.status} />
      },
      {
        key: "revenue",
        header: "Revenue",
        render: (item: Client) => (
          <span className="font-semibold">
            {item.annualRevenue ? formatCurrency(item.annualRevenue) : "No informado"}
          </span>
        )
      },
      {
        key: "actions",
        header: "",
        className: "text-right",
        render: (item: Client) => (
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedClient(item);
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
    const activeClients = items.filter((item) => item.status === "ACTIVE").length;
    const leads = items.filter((item) => item.status === "LEAD").length;
    const portfolioRevenue = items.reduce((total, item) => total + Number(item.annualRevenue ?? 0), 0);

    return [
      { label: "Clientes visibles", value: String(items.length), hint: clientsQuery.isFetching ? "Actualizando resultados" : "Segmento cargado en esta pagina" },
      { label: "Clientes activos", value: String(activeClients), hint: "Cuentas en relacion activa" },
      { label: "Revenue visible", value: formatCurrency(portfolioRevenue), hint: `${leads} leads en seguimiento` }
    ];
  }, [clientsQuery.isFetching, items]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Clientes"
        title="Relaciones comerciales bien organizadas"
        description="Busqueda, filtros y edicion rapida para una vista de cuentas mas cercana a producto real que a una demo generica."
        action={
          <Button
            onClick={() => {
              setSelectedClient(null);
              setModalOpen(true);
            }}
          >
            Nuevo cliente
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
            placeholder="Buscar por empresa, contacto o email"
          />
          <Select
            value={status}
            onChange={(event) => {
              setPage(1);
              setStatus(event.target.value as Client["status"] | "");
            }}
          >
            <option value="">Todos los estados</option>
            <option value="LEAD">Lead</option>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </Select>
        </div>
      </Card>

      {clientsQuery.isLoading ? (
        <Spinner />
      ) : clientsQuery.isError ? (
        <EmptyState
          title="No pudimos cargar clientes"
          description={clientsQuery.error instanceof Error ? clientsQuery.error.message : "Ha ocurrido un error inesperado"}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="No hay clientes con esos filtros"
          description="Prueba otra busqueda o crea el primer cliente desde este panel."
        />
      ) : (
        <Card className="space-y-5">
          {clientsQuery.isFetching ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Actualizando resultados...
            </div>
          ) : null}
          <Table columns={columns} data={items} rowKey={(item) => item.id} />
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </Card>
      )}

      <Modal
        open={modalOpen}
        title={selectedClient ? "Editar cliente" : "Nuevo cliente"}
        onClose={() => {
          setModalOpen(false);
          setSelectedClient(null);
        }}
      >
        <ClientForm
          initialValues={selectedClient ?? undefined}
          ownerId={user!.id}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setSelectedClient(null);
          }}
        />
      </Modal>
    </div>
  );
};
