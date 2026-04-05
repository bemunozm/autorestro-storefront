export function formatPrice(
  price: number,
  currency: string = 'CLP',
  locale: string = 'es-CL'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price);
}
