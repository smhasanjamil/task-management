import { z } from "zod";

const createProjectZodSchema = z.object({
    body: z.object({
        projectName: z.string({
            required_error: "Project name is required",
        }),
        projectId: z.string({
            required_error: "Project ID is required",
        }),
        station: z.string({
            required_error: "Station is required",
        }),
        deadline: z.string({
            required_error: "Deadline is required",
        }),
        value: z.number({
            required_error: "Value is required",
        }),
        teamId: z.string().optional(),
        uiMemberIds: z.array(z.string()).optional(),
        frontendMemberIds: z.array(z.string()).optional(),
        backendMemberIds: z.array(z.string()).optional(),
        estimateDelivery: z.string().optional(),
        projectStatus: z.enum(['new', 'ui_ux', 'wip', 'qa', 'delivered', 'revision', 'cancelled']).default('new'),
        clientStatus: z.enum(['active', 'satisfied', 'neutral', 'dissatisfied', 'inactive']).default('active'),
        figmaLink: z.string().optional(),
        liveLink: z.string().optional(),
        requirementsLink: z.string().optional(),
        note: z.string().optional(),
    }),
});

//====================Project Update validation==================

const updateProjectZodSchema = z.object({
    body: z.object({
        projectName: z.string().optional(),
        projectId: z.string().optional(),
        station: z.string().optional(),
        deadline: z.string().optional(),
        value: z.number().optional(),
        teamId: z.string().optional(),
        uiMemberIds: z.array(z.string()).optional(),
        frontendMemberIds: z.array(z.string()).optional(),
        backendMemberIds: z.array(z.string()).optional(),
        estimateDelivery: z.string().optional(),
        projectStatus: z.enum(['new', 'ui_ux', 'wip', 'qa', 'delivered', 'revision', 'cancelled']).optional(),
        clientStatus: z.enum(['active', 'satisfied', 'neutral', 'dissatisfied', 'inactive']).optional(),
        figmaLink: z.string().optional(),
        liveLink: z.string().optional(),
        requirementsLink: z.string().optional(),
        note: z.string().optional(),
    }),
});

export const ProjectValidation = {
    createProjectZodSchema,
    updateProjectZodSchema
};