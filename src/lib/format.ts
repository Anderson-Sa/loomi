export function formatPriceCents(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatInstallments(cents: number, maxInstallments = 3) {
  const installmentCents = Math.round(cents / maxInstallments);
  return `${maxInstallments}x de ${formatPriceCents(installmentCents)} sem juros`;
}
