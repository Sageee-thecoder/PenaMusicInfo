
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, bandMembers, InsertBandMember, applications, InsertApplication, songs, InsertSong, Song, likes, InsertLike, comments, InsertComment, memberAccessCodes, InsertMemberAccessCode } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Band members queries
export async function getBandMembers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bandMembers).orderBy(bandMembers.order);
}

export async function createBandMember(member: InsertBandMember) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(bandMembers).values(member);
  return result;
}

export async function updateBandMember(id: number, member: Partial<InsertBandMember>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(bandMembers).set(member).where(eq(bandMembers.id, id));
}

export async function deleteBandMember(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(bandMembers).where(eq(bandMembers.id, id));
}

// Applications queries
export async function getApplications(status?: string) {
  const db = await getDb();
  if (!db) return [];
  if (status) {
    return db.select().from(applications).where(eq(applications.status, status as any));
  }
  return db.select().from(applications).orderBy(applications.createdAt);
}

export async function getApplicationById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(applications).where(eq(applications.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createApplication(app: InsertApplication) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(applications).values(app);
  return result;
}

export async function updateApplication(id: number, app: Partial<InsertApplication>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(applications).set(app).where(eq(applications.id, id));
}

export async function deleteApplication(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(applications).where(eq(applications.id, id));
}



// Member access codes queries
export async function getMemberAccessCode(accessCode: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(memberAccessCodes).where(eq(memberAccessCodes.accessCode, accessCode)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createMemberAccessCode(code: InsertMemberAccessCode) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(memberAccessCodes).values(code);
}

export async function getMemberAccessCodeByMemberId(bandMemberId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(memberAccessCodes).where(eq(memberAccessCodes.bandMemberId, bandMemberId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// Songs queries
export async function getSongs(bandMemberId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (bandMemberId) {
    return db.select().from(songs).where(eq(songs.bandMemberId, bandMemberId)).orderBy(songs.createdAt);
  }
  return db.select().from(songs).orderBy(songs.createdAt);
}

export async function getSongById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(songs).where(eq(songs.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createSong(song: InsertSong) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(songs).values(song);
}

export async function updateSong(id: number, song: Partial<InsertSong>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(songs).set(song).where(eq(songs.id, id));
}

export async function deleteSong(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(songs).where(eq(songs.id, id));
}

// Likes queries
export async function getLikesBySongId(songId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(likes).where(eq(likes.songId, songId));
}

export async function checkLike(songId: number, likedByMemberId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(likes).where(and(eq(likes.songId, songId), eq(likes.likedByMemberId, likedByMemberId))).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createLike(like: InsertLike) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(likes).values(like);
}

export async function deleteLike(songId: number, likedByMemberId: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(likes).where(and(eq(likes.songId, songId), eq(likes.likedByMemberId, likedByMemberId)));
}

// Comments queries
export async function getCommentsBySongId(songId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(comments).where(eq(comments.songId, songId)).orderBy(comments.createdAt);
}

export async function createComment(comment: InsertComment) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(comments).values(comment);
}

export async function deleteComment(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(comments).where(eq(comments.id, id));
}
