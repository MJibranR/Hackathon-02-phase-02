import { z } from "zod";

// Schema for user signup validation
export const SignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// Schema for user login validation
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"), // Password presence is enough for login
});

// Schema for task creation validation
export const TaskCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less"),
  description: z.string().max(1000, "Description must be 1000 characters or less").optional(),
});

// Schema for task update validation
export const TaskUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less").optional(),
  description: z.string().max(1000, "Description must be 1000 characters or less").optional(),
  completed: z.boolean().optional(),
});
