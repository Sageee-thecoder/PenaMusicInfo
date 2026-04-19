import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getBandMembers, createBandMember, updateBandMember, deleteBandMember, getApplications, getApplicationById, createApplication, updateApplication } from "./db";
import { TRPCError } from "@trpc/server";

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

  // Band members router
  bandMembers: router({
    list: publicProcedure.query(() => getBandMembers()),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        role: z.enum(["vokal", "gitarist", "baterist", "kemancı", "piyanist"]),
        bio: z.string().optional(),
        imageUrl: z.string().optional(),
        order: z.number().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return createBandMember(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        role: z.enum(["vokal", "gitarist", "baterist", "kemancı", "piyanist"]).optional(),
        bio: z.string().optional(),
        imageUrl: z.string().optional(),
        order: z.number().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const { id, ...data } = input;
        return updateBandMember(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return deleteBandMember(input.id);
      }),
  }),

  // Applications router
  applications: router({
    list: protectedProcedure
      .input(z.object({ status: z.string().optional() }).optional())
      .query(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return getApplications(input?.status);
      }),
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return getApplicationById(input.id);
      }),
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        appliedRole: z.enum(["vokal", "gitarist", "baterist", "kemancı", "piyanist"]),
        message: z.string().optional(),
      }))
      .mutation(({ input }) => createApplication({ ...input, status: "pending" })),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "reviewed", "accepted", "rejected"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const { id, ...data } = input;
        return updateApplication(id, data);
      }),
  }),
});

export type AppRouter = typeof appRouter;
