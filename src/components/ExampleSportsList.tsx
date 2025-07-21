import { useSportsQuery } from '@/hooks/useSportsQuery';

export function ExampleSportsList() {
  const { data, isLoading, error } = useSportsQuery();

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur lors du chargement</div>;

  return (
    <ul>
      {data?.map((sport: any) => (
        <li key={sport.id}>{sport.name}</li>
      ))}
    </ul>
  );
}
