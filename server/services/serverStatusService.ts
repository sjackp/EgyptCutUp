import { assettoCorsaQuery, type AssettoCorsaServerInfo, type ServerConfig } from './assettoCorsaQuery';
import { storage } from '../storage';

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

class ServerStatusService {
  private statusCache = new Map<number, ServerStatus>();
  private updateInterval: NodeJS.Timeout | null = null;
  private isUpdating = false;

  constructor() {
    // Start periodic updates
    this.startPeriodicUpdates();
  }

  /**
   * Start periodic server status updates
   */
  private startPeriodicUpdates() {
    // Update every 45 seconds
    this.updateInterval = setInterval(() => {
      this.updateAllServerStatuses();
    }, 45000);

    // Initial update
    this.updateAllServerStatuses();
  }

  /**
   * Update status for all servers
   */
  private async updateAllServerStatuses() {
    if (this.isUpdating) return;

    this.isUpdating = true;
    try {
      // Get all servers from database
      const servers = await storage.getServers();
      
      // Convert to server configs for UDP queries
      const serverConfigs: ServerConfig[] = servers.map(server => ({
        id: server.id,
        ip: '2.58.113.84', // Use the provided IP
        port: 8094, // Use the provided port
        name: server.name
      }));

      // Query all servers concurrently
      const liveStatuses = await assettoCorsaQuery.queryMultipleServers(serverConfigs);

      // Update cache with live data and merge with database info
      liveStatuses.forEach(liveStatus => {
        const dbServer = servers.find(s => s.id === liveStatus.id);
        if (dbServer) {
          this.statusCache.set(liveStatus.id, {
            ...liveStatus,
            region: dbServer.region,
            joinLink: dbServer.joinLink || undefined,
            bannerUrl: dbServer.bannerUrl || undefined,
            trafficDensity: dbServer.trafficDensity || undefined,
            availableVipSlots: dbServer.availableVipSlots || undefined,
            gameMode: dbServer.gameMode || undefined
          });
        }
      });

      console.log(`[ServerStatus] Updated ${liveStatuses.length} servers`);
    } catch (error) {
      console.error('[ServerStatus] Failed to update server statuses:', error);
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Get current status for all servers
   */
  async getAllServerStatuses(): Promise<ServerStatus[]> {
    // If cache is empty, trigger an update
    if (this.statusCache.size === 0) {
      await this.updateAllServerStatuses();
    }

    return Array.from(this.statusCache.values());
  }

  /**
   * Get status for a specific server
   */
  async getServerStatus(serverId: number): Promise<ServerStatus | null> {
    try {
      // Validate serverId
      if (!serverId || isNaN(serverId)) {
        console.error(`[ServerStatus] Invalid server ID: ${serverId}`);
        return null;
      }

      // If not in cache, trigger an update
      if (!this.statusCache.has(serverId)) {
        await this.updateAllServerStatuses();
      }

      return this.statusCache.get(serverId) || null;
    } catch (error) {
      console.error(`[ServerStatus] Error getting server status for ID ${serverId}:`, error);
      return null;
    }
  }

  /**
   * Force update for a specific server
   */
  async forceUpdateServer(serverId: number): Promise<ServerStatus | null> {
    try {
      const server = await storage.getServer(serverId);
      if (!server) return null;

      const serverConfig: ServerConfig = {
        id: server.id,
        ip: '2.58.113.84',
        port: 8094,
        name: server.name
      };

      const liveStatus = await assettoCorsaQuery.queryServer(serverConfig.ip, serverConfig.port);
      
      const status: ServerStatus = {
        ...liveStatus,
        id: server.id,
        region: server.region,
        joinLink: server.joinLink || undefined,
        bannerUrl: server.bannerUrl || undefined,
        trafficDensity: server.trafficDensity || undefined,
        availableVipSlots: server.availableVipSlots || undefined,
        gameMode: server.gameMode || undefined
      };

      this.statusCache.set(serverId, status);
      return status;
    } catch (error) {
      console.error(`[ServerStatus] Failed to force update server ${serverId}:`, error);
      
      // Return offline status
      const server = await storage.getServer(serverId);
      if (!server) return null;

      const offlineStatus: ServerStatus = {
        id: server.id,
        name: server.name,
        players: 0,
        maxPlayers: server.maxPlayers,
        track: 'Unknown',
        session: 'Unknown',
        status: 'offline',
        lastUpdate: new Date(),
        region: server.region,
        joinLink: server.joinLink || undefined,
        bannerUrl: server.bannerUrl || undefined,
        trafficDensity: server.trafficDensity || undefined,
        availableVipSlots: server.availableVipSlots || undefined,
        gameMode: server.gameMode || undefined
      };

      this.statusCache.set(serverId, offlineStatus);
      return offlineStatus;
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      cachedServers: this.statusCache.size,
      isUpdating: this.isUpdating,
      lastUpdate: this.statusCache.size > 0 
        ? Math.max(...Array.from(this.statusCache.values()).map(s => s.lastUpdate.getTime()))
        : null
    };
  }

  /**
   * Stop the service and clean up resources
   */
  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    assettoCorsaQuery.destroy();
  }
}

// Export singleton instance
export const serverStatusService = new ServerStatusService(); 