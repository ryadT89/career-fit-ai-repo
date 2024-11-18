import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { create } from "domain";
import { get } from "http";

export const invitationRouter = createTRPCRouter({
    // Fetch all job listings
  getAllInvitations: publicProcedure.query(async ({ctx}) => {
    return ctx.db.invitation.findMany({
        include: {
            recruiter:
            {
                include: {
                    user: true,
                }
            },
            candidate:
            {
                include: {
                    user: true,
                }
            },
        },
        });
  }),

  createInvitation: publicProcedure
    .input(
      z.object({
        recruiterId: z.number(),
        candidateId: z.number(),
        message: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db.invitation.create({
        data: {
            recruiterId: input.recruiterId,
            candidateId: input.candidateId,
            message: input.message,
        },
    });
  }),

  getInvitationById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.invitation.findUnique({
        where: { id: input.id },
        include: {
            recruiter:
            {
                include: {
                    user: true,
                }
            },
            candidate:
            {
                include: {
                    user: true,
                }
            },
        },
    });
  }),

  getInvitationsByRecruiterId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.invitation.findMany({
        where: { recruiterId: input.id },
        include: {
            recruiter:
            {
                include: {
                    user: true,
                }
            },
            candidate:
            {
                include: {
                    user: true,
                }
            },
        },
    });
  }),

  getInvitationsByRecruiterUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.invitation.findMany({
        where: { recruiter: { userId: input.id } },
        include: {
            recruiter:
            {
                include: {
                    user: true,
                }
            },
            candidate:
            {
                include: {
                    user: true,
                }
            },
        },
    });
  }),

  getInvitationsByCandidateId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.invitation.findMany({
        where: { candidateId: input.id },
        include: {
            recruiter:
            {
                include: {
                    user: true,
                }
            },
            candidate:
            {
                include: {
                    user: true,
                }
            },
        },
    });
  }),

  getInvitationsByCandidateUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.invitation.findMany({
        where: { candidate: { userId: input.id } },
        include: {
            recruiter:
            {
                include: {
                    user: true,
                }
            },
            candidate:
            {
                include: {
                    user: true,
                }
            },
        },
    });
  }),
});
