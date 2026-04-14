export const inr = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};
