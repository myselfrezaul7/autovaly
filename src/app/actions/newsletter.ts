"use server";

import { newsletterSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { formatErrorResponse, ValidationError, RateLimitError } from "@/lib/errors";
import { headers } from "next/headers";

const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY ||
  process.env.WEB3FORMS_KEY ||
  "3281e53d-d6de-433b-ac48-98dc9f829145";

export async function subscribeNewsletter(formData: FormData) {
  try {
    const honeypot = formData.get("_hp_code")?.toString();
    if (honeypot && honeypot.trim().length > 0) {
      logger.warn("Security warning: Bot detected via newsletter honeypot (_hp_code)", { honeypot });
      return { success: true as const, botBlocked: true as const };
    }

    const rawEmail = formData.get("email")?.toString() || "";

    // Rate limit by IP
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    const rateCheck = rateLimit(`newsletter:${ip}`, 5, 60 * 1000);
    if (!rateCheck.success) {
      throw new RateLimitError("Too many subscription attempts. Please wait a minute.");
    }

    // Validate email
    const result = newsletterSchema.safeParse({ email: rawEmail });
    if (!result.success) {
      throw new ValidationError("Invalid email address", result.error.flatten().fieldErrors);
    }

    const { email } = result.data;

    logger.info("Newsletter subscription validated for Web3Forms dispatch", { email });

    return {
      success: true as const,
      web3Payload: {
        access_key: WEB3FORMS_KEY,
        email,
        from_name: "Autovaly Newsletter",
        subject: `New Newsletter Subscriber: ${email}`,
        message: `A new subscriber has joined the Autovaly newsletter.\n\nEmail: ${email}\nTimestamp: ${new Date().toISOString()}`,
        botcheck: "",
      },
      message: "You're in! Welcome to the fast lane.",
    };
  } catch (error) {
    logger.warn("Newsletter subscription failed", { error });
    return formatErrorResponse(error);
  }
}
