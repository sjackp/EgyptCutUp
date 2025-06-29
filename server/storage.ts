import {
  users,
  servers,
  cars,
  shopItems,
  discordStats,
  type User,
  type UpsertUser,
  type Server,
  type InsertServer,
  type Car,
  type InsertCar,
  type ShopItem,
  type InsertShopItem,
  type DiscordStats,
  type InsertDiscordStats,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Server operations
  getServers(): Promise<Server[]>;
  getServer(id: number): Promise<Server | undefined>;
  createServer(server: InsertServer): Promise<Server>;
  updateServer(id: number, server: Partial<InsertServer>): Promise<Server | undefined>;
  deleteServer(id: number): Promise<boolean>;
  
  // Car operations
  getCars(): Promise<Car[]>;
  getCarsByMake(make: string): Promise<Car[]>;
  getCar(id: number): Promise<Car | undefined>;
  createCar(car: InsertCar): Promise<Car>;
  updateCar(id: number, car: Partial<InsertCar>): Promise<Car | undefined>;
  deleteCar(id: number): Promise<boolean>;
  
  // Shop operations
  getShopItems(): Promise<ShopItem[]>;
  getShopItem(id: number): Promise<ShopItem | undefined>;
  createShopItem(item: InsertShopItem): Promise<ShopItem>;
  updateShopItem(id: number, item: Partial<InsertShopItem>): Promise<ShopItem | undefined>;
  deleteShopItem(id: number): Promise<boolean>;
  
  // Discord stats
  getDiscordStats(): Promise<DiscordStats | undefined>;
  updateDiscordStats(stats: InsertDiscordStats): Promise<DiscordStats>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Server operations
  async getServers(): Promise<Server[]> {
    return await db.select().from(servers).orderBy(desc(servers.createdAt));
  }

  async getServer(id: number): Promise<Server | undefined> {
    const [server] = await db.select().from(servers).where(eq(servers.id, id));
    return server;
  }

  async createServer(server: InsertServer): Promise<Server> {
    const [newServer] = await db.insert(servers).values(server).returning();
    return newServer;
  }

  async updateServer(id: number, server: Partial<InsertServer>): Promise<Server | undefined> {
    const [updatedServer] = await db
      .update(servers)
      .set({ ...server, updatedAt: new Date() })
      .where(eq(servers.id, id))
      .returning();
    return updatedServer;
  }

  async deleteServer(id: number): Promise<boolean> {
    const result = await db.delete(servers).where(eq(servers.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Car operations
  async getCars(): Promise<Car[]> {
    return await db.select().from(cars).where(eq(cars.isActive, true)).orderBy(desc(cars.createdAt));
  }

  async getCarsByMake(make: string): Promise<Car[]> {
    return await db.select().from(cars)
      .where(and(eq(cars.make, make), eq(cars.isActive, true)))
      .orderBy(desc(cars.createdAt));
  }

  async getCar(id: number): Promise<Car | undefined> {
    const [car] = await db.select().from(cars).where(eq(cars.id, id));
    return car;
  }

  async createCar(car: InsertCar): Promise<Car> {
    const [newCar] = await db.insert(cars).values(car).returning();
    return newCar;
  }

  async updateCar(id: number, car: Partial<InsertCar>): Promise<Car | undefined> {
    const [updatedCar] = await db
      .update(cars)
      .set({ ...car, updatedAt: new Date() })
      .where(eq(cars.id, id))
      .returning();
    return updatedCar;
  }

  async deleteCar(id: number): Promise<boolean> {
    const result = await db.delete(cars).where(eq(cars.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Shop operations
  async getShopItems(): Promise<ShopItem[]> {
    return await db.select().from(shopItems).where(eq(shopItems.isActive, true)).orderBy(desc(shopItems.createdAt));
  }

  async getShopItem(id: number): Promise<ShopItem | undefined> {
    const [item] = await db.select().from(shopItems).where(eq(shopItems.id, id));
    return item;
  }

  async createShopItem(item: InsertShopItem): Promise<ShopItem> {
    const [newItem] = await db.insert(shopItems).values(item).returning();
    return newItem;
  }

  async updateShopItem(id: number, item: Partial<InsertShopItem>): Promise<ShopItem | undefined> {
    const [updatedItem] = await db
      .update(shopItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(shopItems.id, id))
      .returning();
    return updatedItem;
  }

  async deleteShopItem(id: number): Promise<boolean> {
    const result = await db.delete(shopItems).where(eq(shopItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Discord stats
  async getDiscordStats(): Promise<DiscordStats | undefined> {
    const [stats] = await db.select().from(discordStats).orderBy(desc(discordStats.lastUpdated)).limit(1);
    return stats;
  }

  async updateDiscordStats(stats: InsertDiscordStats): Promise<DiscordStats> {
    const [newStats] = await db.insert(discordStats).values(stats).returning();
    return newStats;
  }
}

export const storage = new DatabaseStorage();
