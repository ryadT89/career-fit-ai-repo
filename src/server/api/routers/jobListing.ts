import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

export const jobListingRouter = createTRPCRouter({
    // Fetch all job listings
    getAllJobListings: publicProcedure.query(async ({ctx}) => {
      return ctx.db.jobListing.findMany({
        include: {
          recruiter: {
            include: {
              user: true,
            }
          },
          applications: true,
          matches: true,
          invitations: true,
        },
      });
    }),

    // Fetch a single job listing by ID
    getJobListingById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        return ctx.db.jobListing.findUnique({
          where: { id: input.id },
          include: {
            recruiter: true,
            applications: true,
            matches: true,
            invitations: true,
          },
        });
      }),

    // Fetch all job listings by user ID
    getJobListingsByRecruiterId: publicProcedure
      .input(z.object({ recruiterId: z.number() }))
      .query(async ({ input, ctx }) => {
        return ctx.db.jobListing.findMany({
          where: { recruiterId: input.recruiterId },
          include: {
            recruiter: true,
            applications: true,
            matches: true,
            invitations: true,
          },
        });
      }),

    // Create a new job listing
    createJobListing: publicProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string(),
          recruiterId: z.number(),
          location: z.string(),
          status: z.string(),
          requiredSkills: z.string(),
          requiredExperience: z.number(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return ctx.db.jobListing.create({
          data: {
            title: input.title,
            description: input.description,
            recruiterId: input.recruiterId,
            location: input.location,
            status: input.status,
            requiredSkills: input.requiredSkills,
            requiredExperience: input.requiredExperience,
          },
        });
      }),

    // Update a job listing
    updateJobListing: publicProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          location: z.string().optional(),
          status: z.string().optional(),
          requiredSkills: z.string().optional(),
          requiredExperience: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        return ctx.db.jobListing.update({
          where: { id },
          data,
        });
      }),

    // Delete a job listing
    deleteJobListing: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        return ctx.db.jobListing.delete({
          where: { id: input.id },
        });
      }),
});
