import {
  admins,
  servers,
  cars,
  shopItems,
  discordStats,
  vipTiers,
  promoCodes,
  siteSettings,
  type Admin,
  type InsertAdmin,
  type Server,
  type InsertServer,
  type Car,
  type InsertCar,
  type ShopItem,
  type InsertShopItem,
  type DiscordStats,
  type InsertDiscordStats,
  type VipTier,
  type InsertVipTier,
  type PromoCode,
  type InsertPromoCode,
  type SiteSetting,
  type InsertSiteSetting,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // Admin operations
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  
  // Server operations
  getServers(): Promise<Server[]>;
  getServer(id: number): Promise<Server | undefined>;
  createServer(server: InsertServer): Promise<Server>;
  updateServer(id: number, server: Partial<InsertServer>): Promise<Server | undefined>;
  deleteServer(id: number): Promise<boolean>;
  
  // Car operations
  getCars(): Promise<Car[]>;
  getCarsByMake(make: string): Promise<Car[]>;
  getCarsByEgyptianPlates(): Promise<Car[]>;
  getCar(id: number): Promise<Car | undefined>;
  createCar(car: InsertCar): Promise<Car>;
  updateCar(id: number, car: Partial<InsertCar>): Promise<Car | undefined>;
  deleteCar(id: number): Promise<boolean>;
  
  // Shop operations
  getShopItems(): Promise<ShopItem[]>;
  getShopItemsByCategory(category: string): Promise<ShopItem[]>;
  getShopItem(id: number): Promise<ShopItem | undefined>;
  createShopItem(item: InsertShopItem): Promise<ShopItem>;
  updateShopItem(id: number, item: Partial<InsertShopItem>): Promise<ShopItem | undefined>;
  deleteShopItem(id: number): Promise<boolean>;
  
  // VIP Tier operations
  getVipTiers(): Promise<VipTier[]>;
  getVipTier(id: number): Promise<VipTier | undefined>;
  createVipTier(tier: InsertVipTier): Promise<VipTier>;
  updateVipTier(id: number, tier: Partial<InsertVipTier>): Promise<VipTier | undefined>;
  deleteVipTier(id: number): Promise<boolean>;
  
  // Promo Code operations
  getPromoCodes(): Promise<PromoCode[]>;
  getPromoCode(id: number): Promise<PromoCode | undefined>;
  getPromoCodeByCode(code: string): Promise<PromoCode | undefined>;
  createPromoCode(promoCode: InsertPromoCode): Promise<PromoCode>;
  updatePromoCode(id: number, promoCode: Partial<InsertPromoCode>): Promise<PromoCode | undefined>;
  deletePromoCode(id: number): Promise<boolean>;
  
  // Site Settings operations
  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSettingsByCategory(category: string): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  createSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
  updateSiteSetting(key: string, setting: Partial<InsertSiteSetting>): Promise<SiteSetting | undefined>;
  deleteSiteSetting(key: string): Promise<boolean>;
  
  // Discord stats
  getDiscordStats(): Promise<DiscordStats | undefined>;
  updateDiscordStats(stats: InsertDiscordStats): Promise<DiscordStats>;
}

export class DatabaseStorage implements IStorage {
  // Admin operations
  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin;
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

  async getCarsByEgyptianPlates(): Promise<Car[]> {
    return await db.select().from(cars)
      .where(and(eq(cars.hasEgyptianPlates, true), eq(cars.isActive, true)))
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

  async getShopItemsByCategory(category: string): Promise<ShopItem[]> {
    return await db.select().from(shopItems)
      .where(and(eq(shopItems.category, category), eq(shopItems.isActive, true)))
      .orderBy(desc(shopItems.createdAt));
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

  // VIP Tier operations
  async getVipTiers(): Promise<VipTier[]> {
    return await db.select().from(vipTiers).where(eq(vipTiers.isActive, true)).orderBy(vipTiers.priority);
  }

  async getVipTier(id: number): Promise<VipTier | undefined> {
    const [tier] = await db.select().from(vipTiers).where(eq(vipTiers.id, id));
    return tier;
  }

  async createVipTier(tier: InsertVipTier): Promise<VipTier> {
    const [newTier] = await db.insert(vipTiers).values(tier).returning();
    return newTier;
  }

  async updateVipTier(id: number, tier: Partial<InsertVipTier>): Promise<VipTier | undefined> {
    const [updatedTier] = await db
      .update(vipTiers)
      .set({ ...tier, updatedAt: new Date() })
      .where(eq(vipTiers.id, id))
      .returning();
    return updatedTier;
  }

  async deleteVipTier(id: number): Promise<boolean> {
    const result = await db.delete(vipTiers).where(eq(vipTiers.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Promo Code operations
  async getPromoCodes(): Promise<PromoCode[]> {
    return await db.select().from(promoCodes).where(eq(promoCodes.isActive, true)).orderBy(desc(promoCodes.createdAt));
  }

  async getPromoCode(id: number): Promise<PromoCode | undefined> {
    const [promoCode] = await db.select().from(promoCodes).where(eq(promoCodes.id, id));
    return promoCode;
  }

  async getPromoCodeByCode(code: string): Promise<PromoCode | undefined> {
    const [promoCode] = await db.select().from(promoCodes).where(eq(promoCodes.code, code));
    return promoCode;
  }

  async createPromoCode(promoCode: InsertPromoCode): Promise<PromoCode> {
    const [newPromoCode] = await db.insert(promoCodes).values(promoCode).returning();
    return newPromoCode;
  }

  async updatePromoCode(id: number, promoCode: Partial<InsertPromoCode>): Promise<PromoCode | undefined> {
    const [updatedPromoCode] = await db
      .update(promoCodes)
      .set({ ...promoCode, updatedAt: new Date() })
      .where(eq(promoCodes.id, id))
      .returning();
    return updatedPromoCode;
  }

  async deletePromoCode(id: number): Promise<boolean> {
    const result = await db.delete(promoCodes).where(eq(promoCodes.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Site Settings operations
  async getSiteSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings).orderBy(siteSettings.category, siteSettings.key);
  }

  async getSiteSettingsByCategory(category: string): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings).where(eq(siteSettings.category, category)).orderBy(siteSettings.key);
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting;
  }

  async createSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const [newSetting] = await db.insert(siteSettings).values(setting).returning();
    return newSetting;
  }

  async updateSiteSetting(key: string, setting: Partial<InsertSiteSetting>): Promise<SiteSetting | undefined> {
    const [updatedSetting] = await db
      .update(siteSettings)
      .set({ ...setting, updatedAt: new Date() })
      .where(eq(siteSettings.key, key))
      .returning();
    return updatedSetting;
  }

  async deleteSiteSetting(key: string): Promise<boolean> {
    const result = await db.delete(siteSettings).where(eq(siteSettings.key, key));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
