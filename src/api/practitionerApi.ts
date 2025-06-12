export const fetchAllPractitioners = async () => {
  const res = await fetch(`/api/doctors`);

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des docteurs");
  }

  const data = await res.json();
  return data;
};
