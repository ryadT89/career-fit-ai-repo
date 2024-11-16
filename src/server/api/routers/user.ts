import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import bcrypt from "bcrypt";

export const userRouter = createTRPCRouter({
    createUser: publicProcedure
        .input(
            z.object({
                firstName: z.string(),
                lastName: z.string(),
                email: z.string(),
                password: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { firstName, lastName, email, password } = input;

            const existingUser = await ctx.db.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                throw new Error("User with this email already exists");
            }

            const hashedPassword: string = await bcrypt.hash(password, 10);

            const user = await ctx.db.user.create({
                data: {
                    name: `${firstName} ${lastName}`,
                    password: hashedPassword,
                    email: email,
                    userType: "",
                    accounts: {
                        create: {
                            type: "credentials",
                            provider: "credentials",
                            providerAccountId: email,
                            refresh_token: hashedPassword,
                        },
                    },
                },
            });

            return {
                message: "User created successfully",
                user: {
                    id: user.id,
                    email: user.email,
                    userType: user.userType,
                    password: user.password,
                },
            };
        }),
    getUserById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.user.findUnique({
                where: { id: input.id },
                include: {
                    candidateProfile: true,
                    recruiterProfile: true,
                },
            });
        }),
    getUserByEmail: publicProcedure
        .input(z.object({ email: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.user.findUnique({
                where: { email: input.email },
                include: {
                    candidateProfile: true,
                    recruiterProfile: true,
                },
            });
        }),
    updateUser: publicProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().optional(),
                email: z.string().optional(),
                password: z.string().optional(),
                userType: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;

            if (data.password) {
                data.password = await bcrypt.hash(data.password, 10);
            }

            return ctx.db.user.update({
                where: { id },
                data,
            });
        }),
    deleteUser: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.user.delete({
                where: { id: input.id },
            });
    })
});
