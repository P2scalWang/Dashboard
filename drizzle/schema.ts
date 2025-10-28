import { boolean, date, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * InfoLog - ตารางรับข้อมูลดิบจากแอดมิน/บอท
 */
export const infoLog = mysqlTable("info_log", {
  id: int("id").autoincrement().primaryKey(),
  lineId: varchar("lineId", { length: 100 }),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  registrationDate: date("registrationDate"),
  expirationDate: date("expirationDate"),
  package: varchar("package", { length: 100 }),
  packagePrice: int("packagePrice"),
  email: varchar("email", { length: 320 }),
  houseGroup: varchar("houseGroup", { length: 50 }),
  houseId: int("houseId"), // เลขบ้าน (อ้างอิงจาก houseList)
  customerName: varchar("customerName", { length: 255 }),
  channel: mysqlEnum("channel", ["line", "facebook", "walk-in", "other"]),
  cancelledOrMoved: mysqlEnum("cancelledOrMoved", ["cancelled", "moved", ""]).default(""),
  syncStatus: mysqlEnum("syncStatus", ["ok", "error", "pending"]).default("pending").notNull(),
  syncNote: text("syncNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InfoLog = typeof infoLog.$inferSelect;
export type InsertInfoLog = typeof infoLog.$inferInsert;

/**
 * รายชื่อรวม - ตารางบ้านหลัก/แอดมินของบ้าน
 */
export const houseList = mysqlTable("house_list", {
  id: int("id").autoincrement().primaryKey(),
  houseNumber: varchar("houseNumber", { length: 50 }).notNull().unique(),
  adminEmail: varchar("adminEmail", { length: 320 }),
  registrationDate: date("registrationDate"),
  status: mysqlEnum("status", ["active", "expired", "moved", "cancelled"]).default("active").notNull(),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HouseList = typeof houseList.$inferSelect;
export type InsertHouseList = typeof houseList.$inferInsert;

/**
 * สมาชิกบ้าน - หนึ่งแถว = 1 สมาชิกในบ้าน
 */
export const houseMembers = mysqlTable("house_members", {
  id: int("id").autoincrement().primaryKey(),
  houseId: int("houseId").notNull(),
  memberEmail: varchar("memberEmail", { length: 320 }).notNull(),
  expirationDate: date("expirationDate"),
  note: text("note"),
  isActive: boolean("isActive").default(true).notNull(),
  lineId: varchar("lineId", { length: 100 }),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  customerName: varchar("customerName", { length: 255 }),
  email: varchar("email", { length: 320 }),
  registrationDate: date("registrationDate"),
  package: varchar("package", { length: 100 }),
  packagePrice: int("packagePrice"),
  channel: mysqlEnum("channel", ["line", "facebook", "walk-in", "other"]),
  status: mysqlEnum("status", ["active", "expired"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HouseMember = typeof houseMembers.$inferSelect;
export type InsertHouseMember = typeof houseMembers.$inferInsert;
