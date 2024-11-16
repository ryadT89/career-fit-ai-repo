import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

export const recuiterProfileRouter = createTRPCRouter({
    // Fetch all job listings
  getAllRecruiters: publicProcedure.query(async ({ctx}) => {
    return ctx.db.recruiterProfile.findMany({
      include: {
        user: true,
      },
    });
  }),

  // Fetch a single recruiter profile by ID
  getRecuiterProfileById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.recruiterProfile.findUnique({
        where: { userId: input.userId },
        include: {
          user: true,
        },
      });
    }),

  // Create a new job listing
  createRecruiterProfile: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        company: z.string(),
        website: z.string(),
        sector: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db.recruiterProfile.create({
        data: {
            userId: input.userId,
            company: input.company,
            website: input.website,
            sector: input.sector,
            description: input.description,
        },
      });
    }),

  // Update a job listing
  updateRecruiterProfile: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        company: z.string(),
        website: z.string(),
        sector: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, ...data } = input;
      return ctx.db.recruiterProfile.update({
        where: { userId },
        data,
      });
    }),

  // Delete a job listing
  deleteRecruiterProfile: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.recruiterProfile.delete({
        where: { userId: input.userId},
      });
    }),
});
