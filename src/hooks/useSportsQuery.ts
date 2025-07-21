import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

async function fetchSports() {
  const { data, error } = await supabase.from('sports').select('*');
  if (error) throw error;
  return data;
}

export function useSportsQuery() {
  return useQuery({
    queryKey: ['sports'],
    queryFn: fetchSports,
    staleTime: 1000 * 60 * 5, // 5 minutes de cache
    retry: 1,
  });
}
