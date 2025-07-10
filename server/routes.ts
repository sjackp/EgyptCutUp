import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./localAuth";
import { insertServerSchema, insertCarSchema, insertShopItemSchema, insertDiscordStatsSchema } from "@shared/schema";
import { z } from "zod";
import { serverStatusService } from "./services/serverStatusService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Health check endpoint
  app.get('/api/health', async (req, res) => {
    try {
      // Test database connection
      await storage.getServers();
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        database: 'connected'
      });
    } catch (error: any) {
      console.error("Health check failed:", error);
      res.status(503).json({ 
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message
      });
    }
  });

  // Auth is now handled in localAuth.ts

  // Server routes
  app.get('/api/servers', async (req, res) => {
    try {
      const servers = await storage.getServers();
      res.json(servers);
    } catch (error: any) {
      console.error("Error fetching servers:", error);
      
      // Provide more specific error messages based on error type
      if (error.code === 'ECONNRESET' || error.message?.includes('socket hang up')) {
        res.status(503).json({ 
          message: "Database connection temporarily unavailable. Please try again in a moment.",
          retryAfter: 5
        });
      } else if (error.code === 'ENOTFOUND') {
        res.status(503).json({ 
          message: "Database service unavailable. Please check your connection.",
          retryAfter: 10
        });
      } else {
        res.status(500).json({ message: "Failed to fetch servers" });
      }
    }
  });

  app.get('/api/servers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const server = await storage.getServer(id);
      if (!server) {
        return res.status(404).json({ message: "Server not found" });
      }
      res.json(server);
    } catch (error) {
      console.error("Error fetching server:", error);
      res.status(500).json({ message: "Failed to fetch server" });
    }
  });

  app.post('/api/servers', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertServerSchema.parse(req.body);
      const server = await storage.createServer(validatedData);
      res.json(server);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating server:", error);
      res.status(500).json({ message: "Failed to create server" });
    }
  });

  app.put('/api/servers/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertServerSchema.partial().parse(req.body);
      const server = await storage.updateServer(id, validatedData);
      if (!server) {
        return res.status(404).json({ message: "Server not found" });
      }
      res.json(server);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating server:", error);
      res.status(500).json({ message: "Failed to update server" });
    }
  });

  app.delete('/api/servers/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteServer(id);
      if (!success) {
        return res.status(404).json({ message: "Server not found" });
      }
      res.json({ message: "Server deleted successfully" });
    } catch (error) {
      console.error("Error deleting server:", error);
      res.status(500).json({ message: "Failed to delete server" });
    }
  });

  // Car routes
  app.get('/api/cars', async (req, res) => {
    try {
      const { make } = req.query;
      const cars = make ? await storage.getCarsByMake(make as string) : await storage.getCars();
      res.json(cars);
    } catch (error) {
      console.error("Error fetching cars:", error);
      res.status(500).json({ message: "Failed to fetch cars" });
    }
  });

  app.get('/api/cars/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const car = await storage.getCar(id);
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      res.json(car);
    } catch (error) {
      console.error("Error fetching car:", error);
      res.status(500).json({ message: "Failed to fetch car" });
    }
  });

  app.post('/api/cars', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCarSchema.parse(req.body);
      const car = await storage.createCar(validatedData);
      res.json(car);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating car:", error);
      res.status(500).json({ message: "Failed to create car" });
    }
  });

  app.put('/api/cars/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCarSchema.partial().parse(req.body);
      const car = await storage.updateCar(id, validatedData);
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      res.json(car);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating car:", error);
      res.status(500).json({ message: "Failed to update car" });
    }
  });

  app.delete('/api/cars/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCar(id);
      if (!success) {
        return res.status(404).json({ message: "Car not found" });
      }
      res.json({ message: "Car deleted successfully" });
    } catch (error) {
      console.error("Error deleting car:", error);
      res.status(500).json({ message: "Failed to delete car" });
    }
  });

  // Shop routes
  app.get('/api/shop', async (req, res) => {
    try {
      const items = await storage.getShopItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching shop items:", error);
      res.status(500).json({ message: "Failed to fetch shop items" });
    }
  });

  app.get('/api/shop/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getShopItem(id);
      if (!item) {
        return res.status(404).json({ message: "Shop item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching shop item:", error);
      res.status(500).json({ message: "Failed to fetch shop item" });
    }
  });

  app.post('/api/shop', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertShopItemSchema.parse(req.body);
      const item = await storage.createShopItem(validatedData);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating shop item:", error);
      res.status(500).json({ message: "Failed to create shop item" });
    }
  });

  app.put('/api/shop/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertShopItemSchema.partial().parse(req.body);
      const item = await storage.updateShopItem(id, validatedData);
      if (!item) {
        return res.status(404).json({ message: "Shop item not found" });
      }
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating shop item:", error);
      res.status(500).json({ message: "Failed to update shop item" });
    }
  });

  app.delete('/api/shop/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteShopItem(id);
      if (!success) {
        return res.status(404).json({ message: "Shop item not found" });
      }
      res.json({ message: "Shop item deleted successfully" });
    } catch (error) {
      console.error("Error deleting shop item:", error);
      res.status(500).json({ message: "Failed to delete shop item" });
    }
  });

  // Discord stats routes
  app.get('/api/discord/stats', async (req, res) => {
    try {
      const stats = await storage.getDiscordStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching Discord stats:", error);
      res.status(500).json({ message: "Failed to fetch Discord stats" });
    }
  });

  app.post('/api/discord/stats', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertDiscordStatsSchema.parse(req.body);
      const stats = await storage.updateDiscordStats(validatedData);
      res.json(stats);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating Discord stats:", error);
      res.status(500).json({ message: "Failed to update Discord stats" });
    }
  });

  // Real-time server status endpoints
  app.get('/api/servers/status', async (req, res) => {
    try {
      const serversWithStatus = await serverStatusService.getAllServerStatuses();
      res.json(serversWithStatus);
    } catch (error) {
      console.error("Error fetching server status:", error);
      res.status(500).json({ message: "Failed to fetch server status" });
    }
  });

  app.get('/api/servers/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid server ID" });
      }
      const serverStatus = await serverStatusService.getServerStatus(id);
      if (!serverStatus) {
        return res.status(404).json({ message: "Server not found" });
      }
      res.json(serverStatus);
    } catch (error) {
      console.error("Error fetching server status:", error);
      res.status(500).json({ message: "Failed to fetch server status" });
    }
  });

  app.post('/api/servers/:id/status/refresh', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid server ID" });
      }
      const serverStatus = await serverStatusService.forceUpdateServer(id);
      if (!serverStatus) {
        return res.status(404).json({ message: "Server not found" });
      }
      res.json(serverStatus);
    } catch (error) {
      console.error("Error refreshing server status:", error);
      res.status(500).json({ message: "Failed to refresh server status" });
    }
  });

  // Server status cache stats endpoint
  app.get('/api/servers/status/stats', async (req, res) => {
    try {
      const stats = serverStatusService.getCacheStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching status stats:", error);
      res.status(500).json({ message: "Failed to fetch status stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
