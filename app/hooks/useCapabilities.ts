'use client';

import { useCallback, useEffect, useState } from 'react';
import { GalaxyData, GalaxyType, Planet, Territory } from '../types';

interface RequestResult {
  success: boolean;
  message?: string;
}

export function useCapabilities() {
  const [data, setData] = useState<GalaxyData>({ rd: [], digital: [] });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllGalaxies = useCallback(async () => {
    const [rdResponse, digitalResponse] = await Promise.all([
      fetch('/api/capabilities?galaxy=rd', { cache: 'no-store' }),
      fetch('/api/capabilities?galaxy=digital', { cache: 'no-store' }),
    ]);

    if (!rdResponse.ok || !digitalResponse.ok) {
      throw new Error('能力地图数据加载失败，请稍后重试。');
    }

    const [rdData, digitalData] = await Promise.all([rdResponse.json(), digitalResponse.json()]);
    setData({
      rd: rdData.planets,
      digital: digitalData.planets,
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadOnMount = async () => {
      try {
        await loadAllGalaxies();
        if (!cancelled) {
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : '能力地图数据加载失败，请稍后重试。');
        }
      } finally {
        if (!cancelled) {
          setIsRefreshing(false);
          setIsLoaded(true);
        }
      }
    };

    loadOnMount();

    return () => {
      cancelled = true;
    };
  }, [loadAllGalaxies]);

  const refreshData = useCallback(async (): Promise<RequestResult> => {
    setIsRefreshing(true);
    setError(null);

    try {
      await loadAllGalaxies();
      return { success: true };
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : '能力地图数据加载失败，请稍后重试。';
      setError(message);
      return { success: false, message };
    } finally {
      setIsRefreshing(false);
      setIsLoaded(true);
    }
  }, [loadAllGalaxies]);

  const runMutation = useCallback(
    async (input: RequestInfo, init?: RequestInit): Promise<RequestResult> => {
      setError(null);
      setIsRefreshing(true);

      try {
        const response = await fetch(input, init);
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          const message = typeof payload.error === 'string' ? payload.error : '操作失败，请稍后重试。';
          setError(message);
          return { success: false, message };
        }

        await loadAllGalaxies();
        return { success: true };
      } catch (requestError) {
        const message = requestError instanceof Error ? requestError.message : '网络异常，请稍后重试。';
        setError(message);
        return { success: false, message };
      } finally {
        setIsRefreshing(false);
        setIsLoaded(true);
      }
    },
    [loadAllGalaxies]
  );

  const getPlanets = useCallback((galaxy: GalaxyType): Planet[] => data[galaxy], [data]);

  const addTerritory = useCallback(
    async (planetId: string, territory: Omit<Territory, 'id'>): Promise<RequestResult> =>
      runMutation('/api/capabilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planetId, territory }),
      }),
    [runMutation]
  );

  const updateTerritory = useCallback(
    async (territoryId: string, updates: Partial<Territory>): Promise<RequestResult> =>
      runMutation('/api/capabilities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ territoryId, updates }),
      }),
    [runMutation]
  );

  const deleteTerritory = useCallback(
    async (territoryId: string): Promise<RequestResult> =>
      runMutation(`/api/capabilities?territoryId=${territoryId}`, {
        method: 'DELETE',
      }),
    [runMutation]
  );

  return {
    data,
    error,
    isLoaded,
    isRefreshing,
    getPlanets,
    addTerritory,
    updateTerritory,
    deleteTerritory,
    refreshData,
  };
}
