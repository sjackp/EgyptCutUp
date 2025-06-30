import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Admin storage table for local authentication
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const servers = pgTable("servers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  region: varchar("region", { length: 50 }).notNull(),
  maxPlayers: integer("max_players").notNull(),
  currentPlayers: integer("current_players").default(0),
  trafficDensity: integer("traffic_density").default(50), // 0-100%
  track: varchar("track", { length: 100 }),
  availableVipSlots: integer("available_vip_slots").default(0),
  joinLink: text("join_link"),
  bannerUrl: text("banner_url"),
  status: varchar("status", { length: 20 }).notNull().default("offline"), // online, offline, maintenance
  gameMode: varchar("game_mode", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cars = pgTable("cars", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  make: varchar("make", { length: 50 }).notNull(),
  year: integer("year").notNull(),
  thumbnail: text("thumbnail"),
  description: text("description"),
  horsepower: integer("horsepower"), // HP
  torque: integer("torque"), // Nm
  weight: integer("weight"), // kg
  maxSpeed: integer("max_speed"), // km/h
  acceleration: decimal("acceleration", { precision: 3, scale: 1 }), // 0-100 km/h in seconds
  downloadLink: text("download_link"),
  category: varchar("category", { length: 50 }).default("standard"), // new, exclusive, standard
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const shopItems = pgTable("shop_items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // merchandise, subscription, dlc, pass
  iconClass: varchar("icon_class", { length: 50 }), // Font Awesome class
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const discordStats = pgTable("discord_stats", {
  id: serial("id").primaryKey(),
  totalMembers: integer("total_members").notNull(),
  onlineMembers: integer("online_members").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Insert schemas
export const insertServerSchema = createInsertSchema(servers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCarSchema = createInsertSchema(cars).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertShopItemSchema = createInsertSchema(shopItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDiscordStatsSchema = createInsertSchema(discordStats).omit({
  id: true,
  lastUpdated: true,
});

// Types
export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = typeof admins.$inferInsert;

export type Server = typeof servers.$inferSelect;
export type InsertServer = z.infer<typeof insertServerSchema>;

export type Car = typeof cars.$inferSelect;
export type InsertCar = z.infer<typeof insertCarSchema>;

export type ShopItem = typeof shopItems.$inferSelect;
export type InsertShopItem = z.infer<typeof insertShopItemSchema>;

export type DiscordStats = typeof discordStats.$inferSelect;
export type InsertDiscordStats = z.infer<typeof insertDiscordStatsSchema>;
