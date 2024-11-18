import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

export const candidateProfileRouter = createTRPCRouter({
    // Fetch all job listings
  getAllCandidates: publicProcedure.query(async ({ctx}) => {
    return ctx.db.candidateProfile.findMany({
      include: {
        user: true,
      },
    });
  }),

  // Fetch a single candidate profile by ID
  getCandidateProfileById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.candidateProfile.findUnique({
        where: { id: input.id },
        include: {
          user: true,
        },
      });
    }),

  getCandidateProfileByUserId: publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input, ctx }) => {
    return ctx.db.candidateProfile.findUnique({
      where: { userId: input.userId },
      include: {
        user: true,
      },
    });
  }),

  // Create a new job listing
  createCandidateProfile: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        skills: z.string(),
        experience: z.number(),
        location: z.string(),
        interestSectors: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db.candidateProfile.create({
        data: {
            userId: input.userId,
            skills: input.skills,
            experience: input.experience,
            location: input.location,
            interestSectors: input.interestSectors,
        },
      });
    }),

  // Update a job listing
  updateCandidateProfile: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        skills: z.string(),
        experience: z.number(),
        location: z.string(),
        interestSectors: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, ...data } = input;
      return ctx.db.candidateProfile.update({
        where: { userId },
        data,
      });
    }),

  // Delete a job listing
  deleteCandidateProfile: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.candidateProfile.delete({
        where: { userId: input.userId},
      });
    }),
});
