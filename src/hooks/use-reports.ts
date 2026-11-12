import { api } from '@/lib/api';
import type { CrimeReport } from '@/types/report';
import { useEffect, useState } from 'react';

export const useMyReports = (limit = 50) => {
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get(`/reports?limit=${limit}`)
      .then((r) => setReports(r.data?.data?.reports ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [limit]);

  return { reports, loading, reload: load };
};
