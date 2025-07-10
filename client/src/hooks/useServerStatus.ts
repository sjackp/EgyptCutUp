import { useState, useEffect, useCallback } from 'react';

export interface ServerStatus {
  id: number;
  name: string;
  players: number;
  maxPlayers: number;
  track: string;
  session: string;
  status: 'online' | 'offline' | 'maintenance';
  lastUpdate: Date;
  region?: string;
  joinLink?: string;
  bannerUrl?: string;
  trafficDensity?: number;
  availableVipSlots?: number;
  gameMode?: string;
}

export interface UseServerStatusOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useServerStatus(options: UseServerStatusOptions = {}) {
  const { autoRefresh = true, refreshInterval = 30000 } = options;
  const [servers, setServers] = useState<ServerStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchServers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/servers/status');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setServers(data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Failed to fetch server status:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch server status');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshServer = useCallback(async (serverId: number) => {
    try {
      const response = await fetch(`/api/servers/${serverId}/status/refresh`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedServer = await response.json();
      setServers(prev => 
        prev.map(server => 
          server.id === serverId ? updatedServer : server
        )
      );
      
      return updatedServer;
    } catch (err) {
      console.error(`Failed to refresh server ${serverId}:`, err);
      throw err;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchServers();
  }, [fetchServers]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchServers();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchServers]);

  return {
    servers,
    isLoading,
    error,
    lastUpdate,
    refreshServers: fetchServers,
    refreshServer
  };
}

export function useIndividualServerStatus(serverId: number, options: UseServerStatusOptions = {}) {
  const { autoRefresh = true, refreshInterval = 30000 } = options;
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchServerStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/servers/${serverId}/status`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setServerStatus(data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error(`Failed to fetch server ${serverId} status:`, err);
      setError(err instanceof Error ? err.message : 'Failed to fetch server status');
    } finally {
      setIsLoading(false);
    }
  }, [serverId]);

  const refreshStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/servers/${serverId}/status/refresh`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedServer = await response.json();
      setServerStatus(updatedServer);
      setLastUpdate(new Date());
      
      return updatedServer;
    } catch (err) {
      console.error(`Failed to refresh server ${serverId}:`, err);
      throw err;
    }
  }, [serverId]);

  // Initial fetch
  useEffect(() => {
    fetchServerStatus();
  }, [fetchServerStatus]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchServerStatus();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchServerStatus]);

  return {
    serverStatus,
    isLoading,
    error,
    lastUpdate,
    refreshStatus
  };
} 