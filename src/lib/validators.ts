import { z } from "zod";

const sanitizeString = (str: string) => str.replace(/<[^>]*>?/gm, "").trim();

export const searchQuerySchema = z.object({
  q: z
    .string()
    .transform(sanitizeString)
    .pipe(z.string().max(100, { message: "Query string too long" })),
  tab: z.enum(["all", "vehicles", "articles", "classics", "evs"]).optional().default("all"),
});

export const newsletterSchema = z.object({
  email: z
    .string()
    .transform((val) => val.trim().toLowerCase())
    .pipe(z.string().email({ message: "Please provide a valid email address" })),
});

export const contactSchema = z.object({
  name: z
    .string()
    .transform(sanitizeString)
    .pipe(z.string().min(2, { message: "Name must be at least 2 characters" }).max(100)),
  email: z
    .string()
    .transform((val) => val.trim().toLowerCase())
    .pipe(z.string().email({ message: "Please provide a valid email address" })),
  subject: z
    .enum([
      "General Inquiry",
      "Editorial Tips / Leaks",
      "Advertising & Partnerships",
      "Vehicle Spec Correction",
      "Editorial Pitch",
      "Bug Report",
    ])
    .default("General Inquiry"),
  message: z
    .string()
    .transform(sanitizeString)
    .pipe(z.string().min(10, { message: "Message must be at least 10 characters" }).max(2000)),
});

export const revalidateSchema = z.object({
  secret: z.string().min(1, { message: "Secret token is required" }),
  tag: z.string().optional(),
  path: z.string().optional(),
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type RevalidateInput = z.infer<typeof revalidateSchema>;
