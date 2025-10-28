# Project TODO

## Database Schema
- [x] สร้าง schema สำหรับตาราง InfoLog
- [x] สร้าง schema สำหรับตาราง รายชื่อรวม (HouseList)
- [x] สร้าง schema สำหรับตาราง สมาชิกบ้าน (HouseMembers)
- [x] Push database schema

## Backend API
- [x] สร้าง query helpers ใน db.ts สำหรับ InfoLog
- [x] สร้าง query helpers ใน db.ts สำหรับ รายชื่อรวม
- [x] สร้าง query helpers ใน db.ts สำหรับ สมาชิกบ้าน
- [x] สร้าง tRPC procedures สำหรับ InfoLog (CRUD)
- [x] สร้าง tRPC procedures สำหรับ รายชื่อรวม (CRUD)
- [x] สร้าง tRPC procedures สำหรับ สมาชิกบ้าน (CRUD)

## Frontend UI
- [x] สร้าง DashboardLayout พร้อม navigation
- [x] สร้างหน้า Dashboard (หน้าหลัก)
- [x] สร้างหน้าจัดการ InfoLog
- [x] สร้างหน้าจัดการรายชื่อรวม
- [x] สร้างหน้าจัดการสมาชิกบ้าน

## Data Seeding
- [x] สร้างข้อมูลตัวอย่าง 10 คนในฐานข้อมูล

## Testing & Deployment
- [x] ทดสอบการทำงานของระบบ
- [x] สร้าง checkpoint สำหรับ deployment

## New Features Request
- [x] สร้างหน้าแสดงเฉพาะสมาชิกที่ active และยังไม่หมดอายุ
- [x] เพิ่มฟีเจอร์แก้ไขกลุ่มบ้านด้วย dropdown ในหน้าสมาชิก

- [x] เรียงลำดับสมาชิกตามเลขบ้านในหน้าสมาชิกที่ใช้งานอยู่

- [x] เพิ่ม dropdown กรองสมาชิกตามเลขบ้านในหน้าสมาชิกบ้าน
- [x] สร้างหน้าใหม่สำหรับแสดงสมาชิกที่พึ่งหมดอายุ

- [x] แสดงจำนวนสมาชิกในแต่ละบ้าน (เช่น 3/5) ในหน้ารายชื่อรวม
- [x] ซ่อนบ้านที่มีสมาชิกครบ 5 คนแล้วออกจาก dropdown
- [x] ตรวจสอบไม่ให้เพิ่มสมาชิกเกิน 5 คนต่อบ้าน

- [x] แก้ไข Dashboard ให้เรียง InfoLog ล่าสุดขึ้นบนสุด
- [x] เพิ่ม dropdown เลือกเลขบ้านใน InfoLog (ซ่อนบ้านที่ครบ 5 คน)
- [x] ลบฟีเจอร์แก้ไขบ้านและลบสมาชิกออกจากหน้าสมาชิกที่ใช้งานอยู่

## Bug Fixes
- [x] แก้ไข InfoLog ให้แก้ไขกลุ่มบ้าน (houseGroup) แทนเลขบ้าน (houseId)
- [x] แก้ไข Dashboard ไม่แสดงข้อมูล InfoLog ใหม่ที่เพิ่มเข้ามา

- [x] เมื่อเพิ่มกลุ่มบ้านใน InfoLog ให้สร้างสมาชิกใน HouseMembers อัตโนมัติ
- [x] เปลี่ยน InfoLog ให้ใช้ dropdown เลือกกลุ่มบ้าน (แทนการพิมพ์เอง)
- [x] Dropdown ต้องตรวจสอบว่าบ้านนั้นไม่เกิน 5 คน
