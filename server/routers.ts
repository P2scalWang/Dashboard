import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  infoLog: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllInfoLogs();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getInfoLogById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        lineId: z.string().optional(),
        phoneNumber: z.string().optional(),
        registrationDate: z.string().optional(),
        expirationDate: z.string().optional(),
        package: z.string().optional(),
        packagePrice: z.number().optional(),
        email: z.string().optional(),
        houseGroup: z.string().optional(),
        customerName: z.string().optional(),
        channel: z.enum(["line", "facebook", "walk-in", "other"]).optional(),
        cancelledOrMoved: z.enum(["cancelled", "moved", ""]).optional(),
        syncStatus: z.enum(["ok", "error", "pending"]).optional(),
        syncNote: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const data = {
          ...input,
          registrationDate: input.registrationDate || undefined,
          expirationDate: input.expirationDate || undefined,
        };
        return await db.createInfoLog(data);
      }),
    
      update: protectedProcedure
      .input(z.object({
        id: z.number(),
        lineId: z.string().optional(),
        phoneNumber: z.string().optional(),
        registrationDate: z.string().optional(),
        expirationDate: z.string().optional(),
        package: z.string().optional(),
        packagePrice: z.number().optional(),
        email: z.string().optional(),
        houseGroup: z.string().optional(),
        customerName: z.string().optional(),
        channel: z.enum(["line", "facebook", "walk-in", "other"]).optional(),
        cancelledOrMoved: z.enum(["cancelled", "moved", ""]).optional(),
        syncStatus: z.enum(["ok", "error", "pending"]).optional(),
      }))
      .mutation(async ({ input }) => {
        // อัปเดต InfoLog
        await db.updateInfoLog(input.id, input);
        
        // ถ้ามีการเพิ่ม houseGroup ให้สร้างสมาชิกใน HouseMembers
        if (input.houseGroup) {
          const log = await db.getInfoLogById(input.id);
          if (log) {
            await db.createMemberFromInfoLog(log);
          }
        }
        
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteInfoLog(input.id);
        return { success: true };
      }),
  }),

  house: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllHouses();
    }),
    listWithMemberCount: protectedProcedure.query(async () => {
      const houses = await db.getAllHouses();
      const members = await db.getAllMembers();
      
      return houses.map(house => {
        const memberCount = members.filter(m => m.houseId === house.id).length;
        return {
          ...house,
          memberCount,
        };
      });
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getHouseById(input.id);
      }),
    
    getByNumber: protectedProcedure
      .input(z.object({ houseNumber: z.string() }))
      .query(async ({ input }) => {
        return await db.getHouseByNumber(input.houseNumber);
      }),
    
    create: protectedProcedure
      .input(z.object({
        houseNumber: z.string(),
        adminEmail: z.string().optional(),
        registrationDate: z.string().optional(),
        status: z.enum(["active", "expired", "moved", "cancelled"]).optional(),
        note: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const data = {
          ...input,
          registrationDate: input.registrationDate || undefined,
        };
        return await db.createHouse(data);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        houseNumber: z.string().optional(),
        adminEmail: z.string().optional(),
        registrationDate: z.string().optional(),
        status: z.enum(["active", "expired", "moved", "cancelled"]).optional(),
        note: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...rest } = input;
        const data = {
          ...rest,
          registrationDate: rest.registrationDate || undefined,
        };
        return await db.updateHouse(id, data);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteHouse(input.id);
        return { success: true };
      }),
  }),

  member: router({
    listAvailableHouses: protectedProcedure.query(async () => {
      const houses = await db.getAllHouses();
      const members = await db.getAllMembers();
      
      // กรองเฉพาะบ้านที่มีสมาชิกไม่ถึง 5 คน
      return houses.filter(house => {
        const memberCount = members.filter(m => m.houseId === house.id).length;
        return memberCount < 5;
      });
    }),
    list: protectedProcedure.query(async () => {
      return await db.getAllMembers();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getMemberById(input.id);
      }),
    
    getByHouseId: protectedProcedure
      .input(z.object({ houseId: z.number() }))
      .query(async ({ input }) => {
        return await db.getMembersByHouseId(input.houseId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        houseId: z.number(),
        memberEmail: z.string(),
        expirationDate: z.string().optional(),
        note: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const data = {
          ...input,
          expirationDate: input.expirationDate || undefined,
        };
        return await db.createMember(data);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        houseId: z.number().optional(),
        memberEmail: z.string().optional(),
        expirationDate: z.string().optional(),
        note: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...rest } = input;
        const data = {
          ...rest,
          expirationDate: rest.expirationDate || undefined,
        };
        return await db.updateMember(id, data);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteMember(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
