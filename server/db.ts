import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, InfoLog, infoLog, InsertInfoLog, HouseList, houseList, InsertHouseList, HouseMember, houseMembers, InsertHouseMember } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

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

// ===== InfoLog Helpers =====
export async function getAllInfoLogs(): Promise<InfoLog[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(infoLog).orderBy(desc(infoLog.createdAt));
}

export async function getInfoLogById(id: number): Promise<InfoLog | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(infoLog).where(eq(infoLog.id, id)).limit(1);
  return result[0];
}

export async function createInfoLog(data: Omit<InsertInfoLog, 'registrationDate' | 'expirationDate'> & { registrationDate?: string; expirationDate?: string }): Promise<InfoLog> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const values: any = { ...data };
  if (data.registrationDate) values.registrationDate = data.registrationDate;
  if (data.expirationDate) values.expirationDate = data.expirationDate;
  const result = await db.insert(infoLog).values(values);
  const id = Number(result[0].insertId);
  const created = await getInfoLogById(id);
  if (!created) throw new Error("Failed to create InfoLog");
  return created;
}

export async function updateInfoLog(id: number, data: Partial<Omit<InsertInfoLog, 'registrationDate' | 'expirationDate'> & { registrationDate?: string; expirationDate?: string }>): Promise<InfoLog> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const values: any = { ...data };
  await db.update(infoLog).set(values).where(eq(infoLog.id, id));
  const updated = await getInfoLogById(id);
  if (!updated) throw new Error("Failed to update InfoLog");
  return updated;
}

export async function deleteInfoLog(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(infoLog).where(eq(infoLog.id, id));
}

// ===== HouseList Helpers =====
export async function getAllHouses(): Promise<HouseList[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(houseList);
}

export async function getHouseById(id: number): Promise<HouseList | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(houseList).where(eq(houseList.id, id)).limit(1);
  return result[0];
}

export async function getHouseByNumber(houseNumber: string): Promise<HouseList | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(houseList).where(eq(houseList.houseNumber, houseNumber)).limit(1);
  return result[0];
}

export async function createHouse(data: Omit<InsertHouseList, 'registrationDate'> & { registrationDate?: string }): Promise<HouseList> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const values: any = { ...data };
  if (data.registrationDate) values.registrationDate = data.registrationDate;
  const result = await db.insert(houseList).values(values);
  const id = Number(result[0].insertId);
  const created = await getHouseById(id);
  if (!created) throw new Error("Failed to create House");
  return created;
}

export async function updateHouse(id: number, data: Partial<Omit<InsertHouseList, 'registrationDate'> & { registrationDate?: string }>): Promise<HouseList> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const values: any = { ...data };
  await db.update(houseList).set(values).where(eq(houseList.id, id));
  const updated = await getHouseById(id);
  if (!updated) throw new Error("Failed to update House");
  return updated;
}

export async function deleteHouse(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(houseList).where(eq(houseList.id, id));
}

// ===== HouseMembers Helpers =====
export async function getAllMembers(): Promise<HouseMember[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(houseMembers);
}

export async function getMemberById(id: number): Promise<HouseMember | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(houseMembers).where(eq(houseMembers.id, id)).limit(1);
  return result[0];
}

export async function getMembersByHouseId(houseId: number): Promise<HouseMember[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(houseMembers).where(eq(houseMembers.houseId, houseId));
}

export async function getActiveMembersByHouseId(houseId: number): Promise<HouseMember[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(houseMembers).where(eq(houseMembers.houseId, houseId));
}

export async function createMember(data: Omit<InsertHouseMember, 'expirationDate'> & { expirationDate?: string }): Promise<HouseMember> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const values: any = { ...data };
  if (data.expirationDate) values.expirationDate = data.expirationDate;
  const result = await db.insert(houseMembers).values(values);
  const id = Number(result[0].insertId);
  const created = await getMemberById(id);
  if (!created) throw new Error("Failed to create Member");
  return created;
}

export async function updateMember(id: number, data: Partial<Omit<InsertHouseMember, 'expirationDate'> & { expirationDate?: string }>): Promise<HouseMember> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const values: any = { ...data };
  await db.update(houseMembers).set(values).where(eq(houseMembers.id, id));
  const updated = await getMemberById(id);
  if (!updated) throw new Error("Failed to update Member");
  return updated;
}

export async function deleteMember(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(houseMembers).where(eq(houseMembers.id, id));
}


// ===== Create Member from InfoLog =====
export async function createMemberFromInfoLog(log: InfoLog): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  if (!log.houseGroup) {
    console.log(`Cannot create member: no houseGroup for log ${log.id}`);
    return;
  }
  
  // หา house ที่ตรงกับ houseGroup
  const houses = await db.select().from(houseList).where(eq(houseList.houseNumber, log.houseGroup));
  
  if (houses.length === 0) {
    console.log(`Cannot create member: house ${log.houseGroup} not found`);
    return;
  }
  
  const house = houses[0];
  
  // ตรวจสอบว่ามีสมาชิกในบ้านนี้กี่คนแล้ว
  const existingMembers = await db.select().from(houseMembers).where(eq(houseMembers.houseId, house.id));
  
  if (existingMembers.length >= 5) {
    console.log(`Cannot create member: house ${log.houseGroup} is full (${existingMembers.length}/5)`);
    return;
  }
  
  // ตรวจสอบว่ามีสมาชิกนี้อยู่แล้วหรือไม่ (ตาม lineId)
  if (log.lineId) {
    const duplicateCheck = await db.select().from(houseMembers).where(
      and(
        eq(houseMembers.houseId, house.id),
        eq(houseMembers.lineId, log.lineId)
      )
    );
    
    if (duplicateCheck.length > 0) {
      console.log(`Member already exists in house ${log.houseGroup}`);
      return;
    }
  }
  
  // สร้างสมาชิกใหม่
  try {
    await db.insert(houseMembers).values({
      houseId: house.id,
      memberEmail: log.email || "",
      lineId: log.lineId,
      phoneNumber: log.phoneNumber,
      customerName: log.customerName,
      email: log.email,
      registrationDate: log.registrationDate,
      expirationDate: log.expirationDate,
      package: log.package,
      packagePrice: log.packagePrice,
      channel: log.channel,
      status: log.expirationDate && new Date(log.expirationDate) > new Date() ? "active" : "expired",
    });
    
    console.log(`✓ Created member ${log.customerName} in house ${log.houseGroup}`);
  } catch (error) {
    console.error(`Error creating member from log ${log.id}:`, error);
  }
}
