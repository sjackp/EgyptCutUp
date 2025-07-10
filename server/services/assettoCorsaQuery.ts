import dgram from 'dgram';
import { promisify } from 'util';

export interface AssettoCorsaServerInfo {
  name: string;
  players: number;
  maxPlayers: number;
  track: string;
  session: string;
  status: 'online' | 'offline';
  lastUpdate: Date;
}

export interface ServerConfig {
  id: number;
  ip: string;
  port: number;
  name: string;
}

class AssettoCorsaQueryService {
  private socket: dgram.Socket;
  private timeout = 5000; // 5 seconds timeout

  constructor() {
    this.socket = dgram.createSocket('udp4');
  }

  /**
   * Query an Assetto Corsa server using UDP protocol
   * @param ip Server IP address
   * @param port Server port
   * @returns Parsed server information
   */
  async queryServer(ip: string, port: number): Promise<AssettoCorsaServerInfo> {
    return new Promise((resolve, reject) => {
      // Create a new socket for each query to avoid conflicts
      const socket = dgram.createSocket('udp4');
      let isResolved = false;

      const cleanup = () => {
        if (!isResolved) {
          try {
            socket.close();
          } catch (error) {
            // Ignore close errors
          }
        }
      };

      const timeout = setTimeout(() => {
        isResolved = true;
        cleanup();
        reject(new Error('Query timeout'));
      }, this.timeout);

      socket.once('message', (msg) => {
        if (isResolved) return;
        isResolved = true;
        clearTimeout(timeout);
        try {
          const serverInfo = this.parseServerResponse(msg);
          cleanup();
          resolve(serverInfo);
        } catch (error) {
          cleanup();
          reject(error);
        }
      });

      socket.once('error', (error) => {
        if (isResolved) return;
        isResolved = true;
        clearTimeout(timeout);
        cleanup();
        reject(error);
      });

      // Send UDP query packet
      const queryPacket = this.createQueryPacket();
      socket.send(queryPacket, port, ip, (error) => {
        if (error && !isResolved) {
          isResolved = true;
          clearTimeout(timeout);
          cleanup();
          reject(error);
        }
      });
    });
  }

  /**
   * Create the UDP query packet for Assetto Corsa servers
   * @returns Buffer containing the query packet
   */
  private createQueryPacket(): Buffer {
    // Assetto Corsa server query packet format
    const packet = Buffer.alloc(8);
    packet.writeUInt32LE(0x00000001, 0); // Magic number
    packet.writeUInt32LE(0x00000000, 4); // Padding
    return packet;
  }

  /**
   * Parse the server response packet
   * @param msg Raw UDP response message
   * @returns Parsed server information
   */
  private parseServerResponse(msg: Buffer): AssettoCorsaServerInfo {
    try {
      let offset = 0;

      // Read magic number (should be 0x00000001)
      const magic = msg.readUInt32LE(offset);
      offset += 4;

      if (magic !== 0x00000001) {
        throw new Error('Invalid response magic number');
      }

      // Read server name (null-terminated string)
      const nameLength = msg.indexOf(0, offset) - offset;
      const name = msg.toString('utf8', offset, offset + nameLength);
      offset += nameLength + 1;

      // Read track name (null-terminated string)
      const trackLength = msg.indexOf(0, offset) - offset;
      const track = msg.toString('utf8', offset, offset + trackLength);
      offset += trackLength + 1;

      // Read session type (null-terminated string)
      const sessionLength = msg.indexOf(0, offset) - offset;
      const session = msg.toString('utf8', offset, offset + sessionLength);
      offset += sessionLength + 1;

      // Read player count and max players
      const players = msg.readUInt8(offset);
      offset += 1;
      const maxPlayers = msg.readUInt8(offset);
      offset += 1;

      return {
        name: name || 'Unknown Server',
        players,
        maxPlayers,
        track: track || 'Unknown Track',
        session: session || 'Unknown Session',
        status: 'online',
        lastUpdate: new Date()
      };
    } catch (error) {
      throw new Error(`Failed to parse server response: ${error}`);
    }
  }

  /**
   * Query multiple servers concurrently
   * @param servers Array of server configurations
   * @returns Array of server information with IDs
   */
  async queryMultipleServers(servers: ServerConfig[]): Promise<(AssettoCorsaServerInfo & { id: number })[]> {
    const queries = servers.map(async (server) => {
      try {
        const info = await this.queryServer(server.ip, server.port);
        return { ...info, id: server.id };
      } catch (error) {
        console.error(`Failed to query server ${server.name} (${server.ip}:${server.port}):`, error);
        return {
          id: server.id,
          name: server.name,
          players: 0,
          maxPlayers: 0,
          track: 'Unknown',
          session: 'Unknown',
          status: 'offline' as const,
          lastUpdate: new Date()
        };
      }
    });

    return Promise.all(queries);
  }

  /**
   * Clean up resources
   */
  destroy() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

// Export singleton instance
export const assettoCorsaQuery = new AssettoCorsaQueryService(); 