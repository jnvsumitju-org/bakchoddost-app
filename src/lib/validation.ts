import { z } from "zod";

export const generateSchema = z.object({
  userName: z.string().min(1, "Enter your name").max(60, "Max 60 characters"),
  friendNames: z
    .array(z.string().min(1, "Friend name required").max(60, "Max 60 characters"))
    .min(1, "Add at least 1 friend")
    .max(10, "Up to 10 friends"),
});

export const authSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});

export const poemSchema = z.object({
  text: z.string().min(1, "Template text is required"),
  instructions: z.string().optional(),
});

export type GenerateForm = z.infer<typeof generateSchema>;
export type AuthForm = z.infer<typeof authSchema>;
export type PoemForm = z.infer<typeof poemSchema>;


