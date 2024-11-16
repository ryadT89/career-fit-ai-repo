import { z } from "zod";

const jobListingType = z.object({
        id: z.number(),
        title: z.string(),
        description: z.string(),
        recruiterId: z.number(),
        location: z.string(),
        status: z.enum(['open', 'filled']),
        requiredSkills: z.string(),
        requiredExperience: z.number(),
    });