import { drizzle } from "drizzle-orm/mysql2";
import { eq, and } from "drizzle-orm";
import { infoLog, houseList, houseMembers } from "./drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function migrateInfoLogToMembers() {
  console.log("Starting migration from InfoLog to HouseMembers...");
  
  // ดึงข้อมูล InfoLog ที่มี houseGroup และยังไม่ได้ย้าย
  const logs = await db.select().from(infoLog).where(eq(infoLog.syncStatus, "ok"));
  
  console.log(`Found ${logs.length} InfoLog records to process`);
  
  let migrated = 0;
  let skipped = 0;
  
  for (const log of logs) {
    if (!log.houseGroup) {
      console.log(`Skipping log ${log.id}: no houseGroup`);
      skipped++;
      continue;
    }
    
    // หา house ที่ตรงกับ houseGroup
    const houses = await db.select().from(houseList).where(eq(houseList.houseNumber, log.houseGroup));
    
    if (houses.length === 0) {
      console.log(`Skipping log ${log.id}: house ${log.houseGroup} not found`);
      skipped++;
      continue;
    }
    
    const house = houses[0];
    
    // ตรวจสอบว่ามีสมาชิกในบ้านนี้กี่คนแล้ว
    const existingMembers = await db.select().from(houseMembers).where(eq(houseMembers.houseId, house.id));
    
    if (existingMembers.length >= 5) {
      console.log(`Skipping log ${log.id}: house ${log.houseGroup} is full (${existingMembers.length}/5)`);
      skipped++;
      continue;
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
        console.log(`Skipping log ${log.id}: member already exists in house ${log.houseGroup}`);
        skipped++;
        continue;
      }
    }
    
    // สร้างสมาชิกใหม่
    try {
      await db.insert(houseMembers).values({
        houseId: house.id,
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
      
      console.log(`✓ Migrated log ${log.id} (${log.customerName}) to house ${log.houseGroup}`);
      migrated++;
    } catch (error) {
      console.error(`Error migrating log ${log.id}:`, error);
      skipped++;
    }
  }
  
  console.log(`\nMigration complete:`);
  console.log(`- Migrated: ${migrated}`);
  console.log(`- Skipped: ${skipped}`);
  console.log(`- Total: ${logs.length}`);
}

migrateInfoLogToMembers().catch(console.error);
