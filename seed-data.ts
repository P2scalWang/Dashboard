import { drizzle } from "drizzle-orm/mysql2";
import { infoLog, houseList, houseMembers } from "./drizzle/schema";

async function seedData() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const db = drizzle(process.env.DATABASE_URL);

  console.log("🌱 Starting data seeding...");

  // ข้อมูล InfoLog
  const infoLogData = [
    {
      lineId: "U1234567890",
      phoneNumber: "0812345678",
      registrationDate: "2025-01-01",
      expirationDate: "2026-01-01",
      package: "Premium",
      packagePrice: 1200,
      email: "somchai.jai@example.com",
      houseGroup: "029",
      customerName: "สมชาย ใจดี",
      channel: "line" as const,
      cancelledOrMoved: "" as const,
      syncStatus: "ok" as const,
      syncNote: "inserted",
    },
    {
      lineId: "U0987654321",
      phoneNumber: "0898765432",
      registrationDate: "2025-01-15",
      expirationDate: "2026-01-15",
      package: "Standard",
      packagePrice: 800,
      email: "somying.rak@example.com",
      houseGroup: "030",
      customerName: "สมหญิง รักสะอาด",
      channel: "facebook" as const,
      cancelledOrMoved: "" as const,
      syncStatus: "ok" as const,
      syncNote: "inserted",
    },
    {
      lineId: "U1122334455",
      phoneNumber: "0811223344",
      registrationDate: "2025-02-01",
      expirationDate: "2026-02-01",
      package: "Premium",
      packagePrice: 1200,
      email: "prasert.dee@example.com",
      houseGroup: "029",
      customerName: "ประเสริฐ ดีเลิศ",
      channel: "line" as const,
      cancelledOrMoved: "" as const,
      syncStatus: "ok" as const,
      syncNote: "inserted",
    },
    {
      lineId: "U2233445566",
      phoneNumber: "0822334455",
      registrationDate: "2025-02-10",
      expirationDate: "2026-02-10",
      package: "Standard",
      packagePrice: 800,
      email: "malee.suk@example.com",
      houseGroup: "031",
      customerName: "มาลี สุขใจ",
      channel: "walk-in" as const,
      cancelledOrMoved: "" as const,
      syncStatus: "ok" as const,
      syncNote: "inserted",
    },
    {
      lineId: "U3344556677",
      phoneNumber: "0833445566",
      registrationDate: "2025-03-01",
      expirationDate: "2026-03-01",
      package: "Premium",
      packagePrice: 1200,
      email: "wichai.yim@example.com",
      houseGroup: "030",
      customerName: "วิชัย ยิ้มแย้ม",
      channel: "line" as const,
      cancelledOrMoved: "" as const,
      syncStatus: "ok" as const,
      syncNote: "inserted",
    },
    {
      lineId: "U4455667788",
      phoneNumber: "0844556677",
      registrationDate: "2025-03-15",
      expirationDate: "2026-03-15",
      package: "Standard",
      packagePrice: 800,
      email: "suda.chai@example.com",
      houseGroup: "032",
      customerName: "สุดา ชัยชนะ",
      channel: "facebook" as const,
      cancelledOrMoved: "" as const,
      syncStatus: "ok" as const,
      syncNote: "inserted",
    },
    {
      lineId: "U5566778899",
      phoneNumber: "0855667788",
      registrationDate: "2025-04-01",
      expirationDate: "2026-04-01",
      package: "Premium",
      packagePrice: 1200,
      email: "anan.pong@example.com",
      houseGroup: "029",
      customerName: "อนันต์ พงษ์ศักดิ์",
      channel: "line" as const,
      cancelledOrMoved: "" as const,
      syncStatus: "ok" as const,
      syncNote: "inserted",
    },
    {
      lineId: "U6677889900",
      phoneNumber: "0866778899",
      registrationDate: "2025-04-20",
      expirationDate: "2026-04-20",
      package: "Standard",
      packagePrice: 800,
      email: "nida.sri@example.com",
      houseGroup: "031",
      customerName: "นิดา ศรีสุข",
      channel: "walk-in" as const,
      cancelledOrMoved: "" as const,
      syncStatus: "ok" as const,
      syncNote: "inserted",
    },
    {
      lineId: "U7788990011",
      phoneNumber: "0877889900",
      registrationDate: "2025-05-01",
      expirationDate: "2026-05-01",
      package: "Premium",
      packagePrice: 1200,
      email: "kamol.boon@example.com",
      houseGroup: "030",
      customerName: "กมล บุญมา",
      channel: "line" as const,
      cancelledOrMoved: "" as const,
      syncStatus: "ok" as const,
      syncNote: "inserted",
    },
    {
      lineId: "U8899001122",
      phoneNumber: "0888990011",
      registrationDate: "2025-05-15",
      expirationDate: "2026-05-15",
      package: "Standard",
      packagePrice: 800,
      email: "pranee.thong@example.com",
      houseGroup: "033",
      customerName: "ปราณี ทองดี",
      channel: "facebook" as const,
      cancelledOrMoved: "" as const,
      syncStatus: "ok" as const,
      syncNote: "inserted",
    },
  ];

  // ข้อมูลบ้าน
  const houseData = [
    {
      houseNumber: "029",
      adminEmail: "admin029@example.com",
      registrationDate: "2025-01-01",
      status: "active" as const,
      note: "บ้านเต็ม 3 คน",
    },
    {
      houseNumber: "030",
      adminEmail: "admin030@example.com",
      registrationDate: "2025-01-15",
      status: "active" as const,
      note: "บ้านมี 3 คน",
    },
    {
      houseNumber: "031",
      adminEmail: "admin031@example.com",
      registrationDate: "2025-02-10",
      status: "active" as const,
      note: "บ้านมี 2 คน",
    },
    {
      houseNumber: "032",
      adminEmail: "admin032@example.com",
      registrationDate: "2025-03-15",
      status: "active" as const,
      note: "บ้านมี 1 คน",
    },
    {
      houseNumber: "033",
      adminEmail: "admin033@example.com",
      registrationDate: "2025-05-15",
      status: "active" as const,
      note: "บ้านมี 1 คน",
    },
  ];

  try {
    // Insert InfoLog data
    console.log("📝 Inserting InfoLog data...");
    for (const log of infoLogData) {
      await db.insert(infoLog).values(log);
    }
    console.log(`✅ Inserted ${infoLogData.length} InfoLog records`);

    // Insert House data
    console.log("🏠 Inserting House data...");
    const houseIds: Record<string, number> = {};
    for (const house of houseData) {
      const result = await db.insert(houseList).values(house);
      houseIds[house.houseNumber] = Number(result[0].insertId);
    }
    console.log(`✅ Inserted ${houseData.length} House records`);

    // Insert Member data
    console.log("👥 Inserting Member data...");
    const memberData = [
      {
        houseId: houseIds["029"],
        memberEmail: "somchai.jai@example.com",
        expirationDate: "2026-01-01",
        note: "สมาชิกคนแรก",
        isActive: true,
      },
      {
        houseId: houseIds["030"],
        memberEmail: "somying.rak@example.com",
        expirationDate: "2026-01-15",
        note: "สมาชิกคนแรก",
        isActive: true,
      },
      {
        houseId: houseIds["029"],
        memberEmail: "prasert.dee@example.com",
        expirationDate: "2026-02-01",
        note: "สมาชิกคนที่ 2",
        isActive: true,
      },
      {
        houseId: houseIds["031"],
        memberEmail: "malee.suk@example.com",
        expirationDate: "2026-02-10",
        note: "สมาชิกคนแรก",
        isActive: true,
      },
      {
        houseId: houseIds["030"],
        memberEmail: "wichai.yim@example.com",
        expirationDate: "2026-03-01",
        note: "สมาชิกคนที่ 2",
        isActive: true,
      },
      {
        houseId: houseIds["032"],
        memberEmail: "suda.chai@example.com",
        expirationDate: "2026-03-15",
        note: "สมาชิกคนแรก",
        isActive: true,
      },
      {
        houseId: houseIds["029"],
        memberEmail: "anan.pong@example.com",
        expirationDate: "2026-04-01",
        note: "สมาชิกคนที่ 3",
        isActive: true,
      },
      {
        houseId: houseIds["031"],
        memberEmail: "nida.sri@example.com",
        expirationDate: "2026-04-20",
        note: "สมาชิกคนที่ 2",
        isActive: true,
      },
      {
        houseId: houseIds["030"],
        memberEmail: "kamol.boon@example.com",
        expirationDate: "2026-05-01",
        note: "สมาชิกคนที่ 3",
        isActive: true,
      },
      {
        houseId: houseIds["033"],
        memberEmail: "pranee.thong@example.com",
        expirationDate: "2026-05-15",
        note: "สมาชิกคนแรก",
        isActive: true,
      },
    ];

    for (const member of memberData) {
      await db.insert(houseMembers).values(member);
    }
    console.log(`✅ Inserted ${memberData.length} Member records`);

    console.log("🎉 Data seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedData();
