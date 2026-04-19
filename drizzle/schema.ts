import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
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
 * Band members table - stores information about group members
 */
export const bandMembers = mysqlTable("band_members", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["vokal", "gitarist", "baterist", "kemancı", "piyanist"]).notNull(),
  bio: text("bio"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BandMember = typeof bandMembers.$inferSelect;
export type InsertBandMember = typeof bandMembers.$inferInsert;

/**
 * Applications table - stores applications from people wanting to join
 */
export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  appliedRole: mysqlEnum("appliedRole", ["vokal", "gitarist", "baterist", "kemancı", "piyanist"]).notNull(),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "reviewed", "accepted", "rejected"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;

/**
 * Member access codes table - stores unique codes for each band member
 */
export const memberAccessCodes = mysqlTable("member_access_codes", {
  id: int("id").autoincrement().primaryKey(),
  bandMemberId: int("band_member_id").notNull(),
  accessCode: varchar("access_code", { length: 50 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MemberAccessCode = typeof memberAccessCodes.$inferSelect;
export type InsertMemberAccessCode = typeof memberAccessCodes.$inferInsert;

/**
 * Songs table - stores songs created by band members
 */
export const songs = mysqlTable("songs", {
  id: int("id").autoincrement().primaryKey(),
  bandMemberId: int("band_member_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  songUrl: varchar("song_url", { length: 500 }),
  youtubeUrl: varchar("youtube_url", { length: 500 }),
  spotifyUrl: varchar("spotify_url", { length: 500 }),
  likesCount: int("likes_count").default(0).notNull(),
  commentsCount: int("comments_count").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Song = typeof songs.$inferSelect;
export type InsertSong = typeof songs.$inferInsert;

/**
 * Likes table - stores likes for songs
 */
export const likes = mysqlTable("likes", {
  id: int("id").autoincrement().primaryKey(),
  songId: int("song_id").notNull(),
  likedByMemberId: int("liked_by_member_id").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Like = typeof likes.$inferSelect;
export type InsertLike = typeof likes.$inferInsert;

/**
 * Comments table - stores comments on songs
 */
export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  songId: int("song_id").notNull(),
  commentedByMemberId: int("commented_by_member_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

/**
 * Events table - stores rehearsals and concerts
 */
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventDate: timestamp("event_date").notNull(),
  location: varchar("location", { length: 500 }),
  eventType: mysqlEnum("event_type", ["prova", "konser", "diger"]).default("diger").notNull(),
  createdBy: int("created_by").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

/**
 * Event participants table - stores which members participate in events
 */
export const eventParticipants = mysqlTable("event_participants", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("event_id").notNull(),
  bandMemberId: int("band_member_id").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EventParticipant = typeof eventParticipants.$inferSelect;
export type InsertEventParticipant = typeof eventParticipants.$inferInsert;
