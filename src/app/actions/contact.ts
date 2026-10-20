"use server";

import { contactSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { formatErrorResponse, ValidationError, RateLimitError } from "@/lib/errors";
import { headers } from "next/headers";

const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY ||
  process.env.WEB3FORMS_KEY ||
  "3281e53d-d6de-433b-ac48-98dc9f829145";

export async function submitContactForm(formData: FormData) {
  try {
    const honeypot = formData.get("_hp_company")?.toString();
    if (honeypot && honeypot.trim().length > 0) {
      logger.warn("Security warning: Bot detected via contact form honeypot (_hp_company)", { honeypot });
      return { success: true as const, botBlocked: true as const };
    }

    const rawData = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      subject: formData.get("subject")?.toString() || "General Inquiry",
      message: formData.get("message")?.toString() || "",
    };

    // Rate limit by IP (5 attempts per minute)
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    const rateCheck = rateLimit(`contact:${ip}`, 5, 60 * 1000);
    if (!rateCheck.success) {
      throw new RateLimitError("Too many contact attempts. Please wait a minute before sending another message.");
    }

    // Validate payload
    const result = contactSchema.safeParse(rawData);
    if (!result.success) {
      throw new ValidationError("Invalid form data", result.error.flatten().fieldErrors);
    }

    const { name, email, subject, message } = result.data;

    logger.info("Contact form validated for Web3Forms dispatch", { name, email, subject });

    return {
      success: true as const,
      web3Payload: {
        access_key: WEB3FORMS_KEY,
        name,
        email,
        from_name: `Autovaly Reader: ${name}`,
        subject: `[Autovaly ${subject}] Message from ${name}`,
        message: `Name: ${name}\nEmail: ${email}\nTopic: ${subject}\n\nMessage:\n${message}\n\nSent: ${new Date().toISOString()}`,
        botcheck: "",
      },
      message: "Message delivered successfully! Our team will review your inquiry shortly.",
    };
  } catch (error) {
    logger.warn("Contact form submission error", { error });
    return formatErrorResponse(error);
  }
}
