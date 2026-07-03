export const formatCurrency = (value: number): string => {
  return `Rp ${value.toLocaleString("id-ID")}`;
};
