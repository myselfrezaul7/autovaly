"use server";

import { newsletterSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { formatErrorResponse, ValidationError, RateLimitError } from "@/lib/errors";
import { headers } from "next/headers";

const WEB3FORMS_API = "https://api.web3forms.com/submit";
const WEB3FORMS_KEY = "3281e53d-d6de-433b-ac48-98dc9f829145";

export async function subscribeNewsletter(formData: FormData) {
  try {
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

    // Submit to Web3Forms so you get the subscriber email in your inbox
    const web3FormData = new FormData();
    web3FormData.append("access_key", WEB3FORMS_KEY);
    web3FormData.append("email", email);
    web3FormData.append("from_name", "Autovaly Newsletter");
    web3FormData.append("subject", `New Newsletter Subscriber: ${email}`);
    web3FormData.append("message", `A new subscriber has joined the Autovaly newsletter.\n\nEmail: ${email}\nTimestamp: ${new Date().toISOString()}`);
    // Anti-bot honeypot
    web3FormData.append("botcheck", "");

    const response = await fetch(WEB3FORMS_API, {
      method: "POST",
      body: web3FormData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      logger.warn("Web3Forms newsletter submission failed", { email, status: response.status, data });
      return {
        success: false as const,
        error: data.message || "Subscription failed. Please try again.",
      };
    }

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
