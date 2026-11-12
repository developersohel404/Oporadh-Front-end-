import { api } from '@/lib/api';
import type { LocationItem } from '@/types/location';
import { useCallback, useState } from 'react';

export const useLocationCascade = () => {
  const [divisions, setDivisions] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [upazilas, setUpazilas] = useState<LocationItem[]>([]);
  const [unions, setUnions] = useState<LocationItem[]>([]);
  const [pourashavas, setPourashavas] = useState<LocationItem[]>([]);

  const loadDivisions = useCallback(async () => {
    try {
      const r = await api.get('/locations/divisions');
      setDivisions(r.data?.data ?? []);
    } catch {
      setDivisions([]);
    }
  }, []);

  const loadDistricts = useCallback(async (divisionId: string) => {
    try {
      const r = await api.get(`/locations/divisions/${divisionId}/districts`);
      setDistricts(r.data?.data?.districts ?? []);
    } catch {
      setDistricts([]);
    }
  }, []);

  const loadUpazilas = useCallback(async (districtId: string) => {
    try {
      const r = await api.get(`/locations/districts/${districtId}/upazilas`);
      setUpazilas(r.data?.data?.upazilas ?? []);
    } catch {
      setUpazilas([]);
    }
  }, []);

  const loadUnionsAndPourashavas = useCallback(async (upazilaId: string) => {
    try {
      const [unionsRes, pourashavasRes] = await Promise.all([
        api
          .get(`/locations/upazilas/${upazilaId}/unions`)
          .catch(() => ({ data: { data: { unions: [] } } })),
        api
          .get(`/locations/upazilas/${upazilaId}/pourashavas`)
          .catch(() => ({ data: { data: { pourashavas: [] } } })),
      ]);
      setUnions(unionsRes.data?.data?.unions ?? []);
      setPourashavas(pourashavasRes.data?.data?.pourashavas ?? []);
    } catch {
      setUnions([]);
      setPourashavas([]);
    }
  }, []);

  const reset = useCallback((level?: 'districts' | 'upazilas' | 'all') => {
    if (!level || level === 'districts' || level === 'all') setDistricts([]);
    if (!level || level === 'upazilas' || level === 'all') setUpazilas([]);
    setUnions([]);
    setPourashavas([]);
  }, []);

  return {
    divisions,
    districts,
    upazilas,
    unions,
    pourashavas,
    loadDivisions,
    loadDistricts,
    loadUpazilas,
    loadUnionsAndPourashavas,
    reset,
  };
};
