'use client';

import { useState, useEffect, useCallback } from 'react';
import { Planet, Territory, GalaxyType, GalaxyData } from '../types';

export function useCapabilities() {
  const [data, setData] = useState<GalaxyData>({
    rd: [],
    digital: []
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [rdResponse, digitalResponse] = await Promise.all([
          fetch('/api/capabilities?galaxy=rd'),
          fetch('/api/capabilities?galaxy=digital')
        ]);

        if (rdResponse.ok && digitalResponse.ok) {
          const rdData = await rdResponse.json();
          const digitalData = await digitalResponse.json();
          
          setData({
            rd: rdData.planets,
            digital: digitalData.planets
          });
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const [rdResponse, digitalResponse] = await Promise.all([
        fetch('/api/capabilities?galaxy=rd'),
        fetch('/api/capabilities?galaxy=digital')
      ]);

      if (rdResponse.ok && digitalResponse.ok) {
        const rdData = await rdResponse.json();
        const digitalData = await digitalResponse.json();
        
        setData({
          rd: rdData.planets,
          digital: digitalData.planets
        });
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  }, []);

  const getPlanets = useCallback((galaxy: GalaxyType): Planet[] => {
    return data[galaxy];
  }, [data]);

  const getPlanet = useCallback((galaxy: GalaxyType, planetId: string): Planet | undefined => {
    return data[galaxy].find(p => p.id === planetId);
  }, [data]);

  const addTerritory = useCallback(async (galaxy: GalaxyType, planetId: string, territory: Omit<Territory, 'id'>): Promise<boolean> => {
    try {
      const response = await fetch('/api/capabilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planetId, territory })
      });

      if (response.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Add territory error:', error);
      return false;
    }
  }, [refreshData]);

  const updateTerritory = useCallback(async (galaxy: GalaxyType, planetId: string, territoryId: string, updates: Partial<Territory>): Promise<boolean> => {
    try {
      const response = await fetch('/api/capabilities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ territoryId, updates })
      });

      if (response.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update territory error:', error);
      return false;
    }
  }, [refreshData]);

  const deleteTerritory = useCallback(async (galaxy: GalaxyType, planetId: string, territoryId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/capabilities?territoryId=${territoryId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Delete territory error:', error);
      return false;
    }
  }, [refreshData]);

  const resetToDefault = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/capabilities/reset', {
        method: 'POST'
      });

      if (response.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Reset error:', error);
      return false;
    }
  }, [refreshData]);

  return {
    data,
    isLoaded,
    getPlanets,
    getPlanet,
    addTerritory,
    updateTerritory,
    deleteTerritory,
    resetToDefault,
    refreshData
  };
}
