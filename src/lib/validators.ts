import { z } from "zod";

const sanitizeString = (str: string) => str.replace(/<[^>]*>?/gm, "").trim();

export const searchQuerySchema = z.object({
  q: z
    .string()
    .transform(sanitizeString)
    .refine((val) => val.length <= 100, { message: "Query string too long" }),
  tab: z.enum(["vehicles", "articles"]).optional().default("vehicles"),
});

export const newsletterSchema = z.object({
  email: z
    .string()
    .email({ message: "Please provide a valid email address" })
    .transform((val) => val.toLowerCase().trim()),
});

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100)
    .transform(sanitizeString),
  email: z
    .string()
    .email({ message: "Please provide a valid email address" })
    .transform((val) => val.toLowerCase().trim()),
  subject: z
    .enum(["General Inquiry", "Editorial Pitch", "Advertising", "Bug Report"])
    .default("General Inquiry"),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(2000)
    .transform(sanitizeString),
});

export const revalidateSchema = z.object({
  secret: z.string().min(1, { message: "Secret token is required" }),
  tag: z.string().optional(),
  path: z.string().optional(),
});
