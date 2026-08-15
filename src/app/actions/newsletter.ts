"use server";

import { newsletterSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { formatErrorResponse, ValidationError, RateLimitError } from "@/lib/errors";
import { headers } from "next/headers";

export async function subscribeNewsletter(formData: FormData) {
  try {
    const rawEmail = formData.get("email")?.toString() || "";

    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    const rateCheck = rateLimit(`newsletter:${ip}`, 5, 60 * 1000);
    if (!rateCheck.success) {
      throw new RateLimitError("Too many subscription attempts. Please wait a minute.");
    }

    const result = newsletterSchema.safeParse({ email: rawEmail });
    if (!result.success) {
      throw new ValidationError("Invalid email address", result.error.flatten().fieldErrors);
    }

    const { email } = result.data;
    logger.info("Newsletter subscription successful", { email });

    return {
      success: true as const,
      message: "You're in! Welcome to the fast lane.",
    };
  } catch (error) {
    logger.warn("Newsletter subscription failed", { error });
    return formatErrorResponse(error);
  }
}
