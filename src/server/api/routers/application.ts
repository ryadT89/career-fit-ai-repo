import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const applicationRouter = createTRPCRouter({
    getAllApplications: publicProcedure.query(async ({ctx}) => {
      return ctx.db.application.findMany({
        include: {
          jobListing: {
            include: {
              recruiter: {
                include: {
                  user: true,
                }
              },
            }
          },
          candidate: {
            include: {
              user: true,
            }
          },
        },
      });
    }),

    getApplicationById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        return ctx.db.application.findUnique({
          where: { id: input.id },
          include: {
            jobListing: {
                include: {
                recruiter: {
                    include: {
                    user: true,
                    }
                },
                }
            },
            candidate: {
                include: {
                user: true,
                }
            },
            },
        });
      }),

    getApplicationByJobListingId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        return ctx.db.application.findUnique({
          where: { id: input.id },
          include: {
            jobListing: {
                include: {
                recruiter: {
                    include: {
                    user: true,
                    }
                },
                }
            },
            candidate: {
                include: {
                user: true,
                }
            },
            },
        });
      }),

    
    getApplicationByCandidateId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        return ctx.db.application.findMany({
          where: { id: input.id },
          include: {
                jobListing: {
                    include: {
                    recruiter: {
                        include: {
                        user: true,
                        }
                    },
                    }
                },
                candidate: {
                    include: {
                    user: true,
                    }
                },
            },
        });
      }),

    
    createApplication: publicProcedure
      .input(
        z.object({
            jobListingId: z.number(),
            candidateId: z.number(),
            status: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return ctx.db.application.create({
          data: {
            jobListingId: input.jobListingId,
            candidateId: input.candidateId,
            status: input.status,
          },
        });
      }),

    
    updateApplication: publicProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        return ctx.db.application.update({
          where: { id},
          data,
        });
      }),

    
    deleteApplication: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        return ctx.db.application.delete({
          where: { id: input.id },
        });
      }),
});
