export const formatCurrency = (value: number | string) => {
  const numeric = typeof value === "string" ? Number(value) : value;

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(Number.isNaN(numeric) ? 0 : numeric);
};

export const formatDate = (value?: string | Date | null) => {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
};
