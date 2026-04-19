import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getBandMembers, createBandMember, updateBandMember, deleteBandMember, getApplications, getApplicationById, createApplication, updateApplication, getMemberAccessCode, createMemberAccessCode, getSongs, createSong, updateSong, deleteSong, getLikesBySongId, checkLike, createLike, deleteLike, getCommentsBySongId, createComment, deleteComment, getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, getEventParticipants, addEventParticipant, removeEventParticipant, getEventWithParticipants } from "./db";
import { TRPCError } from "@trpc/server";
import { sendApplicationStatusEmail, sendApplicationConfirmationEmail } from "./email";

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
    list: publicProcedure.query(() => getApplications()),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getApplicationById(input.id)),
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        appliedRole: z.enum(["vokal", "gitarist", "baterist", "kemancı", "piyanist"]),
        message: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await createApplication(input);
        await sendApplicationConfirmationEmail(input.email, input.name);
        return result;
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "reviewed", "accepted", "rejected"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const app = await getApplicationById(input.id);
        if (!app) throw new TRPCError({ code: "NOT_FOUND" });
        const result = await updateApplication(input.id, input);
        if (input.status && app.email) {
          await sendApplicationStatusEmail(app.email, app.name, input.status);
        }
        return result;
      }),
  }),

  // Songs router
  songs: router({
    list: publicProcedure.query(() => getSongs()),
    create: protectedProcedure
      .input(z.object({
        bandMemberId: z.number(),
        title: z.string().min(1),
        description: z.string().optional(),
        songUrl: z.string().optional(),
        youtubeUrl: z.string().optional(),
        spotifyUrl: z.string().optional(),
      }))
      .mutation(({ input }) => createSong(input)),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        songUrl: z.string().optional(),
        youtubeUrl: z.string().optional(),
        spotifyUrl: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const { id, ...data } = input;
        return updateSong(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return deleteSong(input.id);
      }),
  }),

  // Likes router
  likes: router({
    list: publicProcedure
      .input(z.object({ songId: z.number() }))
      .query(({ input }) => getLikesBySongId(input.songId)),
    toggle: publicProcedure
      .input(z.object({ songId: z.number(), memberId: z.number() }))
      .mutation(async ({ input }) => {
        const existing = await checkLike(input.songId, input.memberId);
        if (existing) {
          await deleteLike(input.songId, input.memberId);
          return { liked: false };
        } else {
          await createLike({ songId: input.songId, likedByMemberId: input.memberId });
          return { liked: true };
        }
      }),
  }),

  // Comments router
  comments: router({
    list: publicProcedure
      .input(z.object({ songId: z.number() }))
      .query(({ input }) => getCommentsBySongId(input.songId)),
    create: publicProcedure
      .input(z.object({
        songId: z.number(),
        commentedByMemberId: z.number(),
        content: z.string().min(1),
      }))
      .mutation(({ input }) => createComment(input)),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteComment(input.id)),
  }),

  // Member access codes router
  memberAccess: router({
    verify: publicProcedure
      .input(z.object({ accessCode: z.string() }))
      .query(async ({ input }) => {
        const code = await getMemberAccessCode(input.accessCode);
        if (!code) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return { memberId: code.bandMemberId, accessCode: code.accessCode };
      }),
  }),

  // Events router
  events: router({
    list: publicProcedure.query(() => getAllEvents()),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getEventById(input.id)),
    getWithParticipants: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getEventWithParticipants(input.id)),
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        eventDate: z.date(),
        location: z.string().optional(),
        eventType: z.enum(["prova", "konser", "diger"]).default("diger"),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return createEvent({
          ...input,
          createdBy: ctx.user.id,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        eventDate: z.date().optional(),
        location: z.string().optional(),
        eventType: z.enum(["prova", "konser", "diger"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const { id, ...data } = input;
        return updateEvent(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return deleteEvent(input.id);
      }),
    addParticipant: protectedProcedure
      .input(z.object({ eventId: z.number(), bandMemberId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return addEventParticipant(input);
      }),
    removeParticipant: protectedProcedure
      .input(z.object({ eventId: z.number(), bandMemberId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return removeEventParticipant(input.eventId, input.bandMemberId);
      }),
    getParticipants: publicProcedure
      .input(z.object({ eventId: z.number() }))
      .query(({ input }) => getEventParticipants(input.eventId)),
  }),
});

export type AppRouter = typeof appRouter;
