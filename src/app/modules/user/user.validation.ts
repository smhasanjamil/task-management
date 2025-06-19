import { z } from "zod";

const userValidationSchema = z.object({
  body: z.object({
    userId: z
      .string({
        required_error: "User ID is required",
        invalid_type_error: "User ID must be a string",
      })
      .min(1, "User ID cannot be empty"),

    userName: z
      .string({
        required_error: "User Name is required",
        invalid_type_error: "User Name must be a string",
      })
      .min(2, "User Name should be at least 2 characters"),

    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .email("Invalid email address"),

    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(6, "Password should be at least 6 characters"),

    role: z.enum(["admin", "leader", "member"], {
      required_error: "Role is required",
      invalid_type_error: "Role must be one of admin, leader, member",
    }),

    image: z
      .string({
        invalid_type_error: "Image must be a string",
      })
      .optional(),

    isActive: z.boolean().optional(),
  }),
});

export const UserValidation = {
  userValidationSchema,
};
