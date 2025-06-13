export const fetchAllPractitioners = async () => {
  const res = await fetch(`/api/practitioners`);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erreur inconnue");
  }

  const data = await res.json();
  return data;
};
