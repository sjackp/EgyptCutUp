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

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const servers = pgTable("servers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  region: varchar("region", { length: 50 }).notNull(),
  maxPlayers: integer("max_players").notNull(),
  currentPlayers: integer("current_players").default(0),
  status: varchar("status", { length: 20 }).notNull().default("offline"), // online, offline, maintenance
  track: varchar("track", { length: 100 }),
  gameMode: varchar("game_mode", { length: 50 }),
  joinLink: text("join_link"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cars = pgTable("cars", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  make: varchar("make", { length: 50 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
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
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type Server = typeof servers.$inferSelect;
export type InsertServer = z.infer<typeof insertServerSchema>;

export type Car = typeof cars.$inferSelect;
export type InsertCar = z.infer<typeof insertCarSchema>;

export type ShopItem = typeof shopItems.$inferSelect;
export type InsertShopItem = z.infer<typeof insertShopItemSchema>;

export type DiscordStats = typeof discordStats.$inferSelect;
export type InsertDiscordStats = z.infer<typeof insertDiscordStatsSchema>;
