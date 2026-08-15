"use server";

import { contactSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { formatErrorResponse, ValidationError, RateLimitError } from "@/lib/errors";
import { headers } from "next/headers";

export async function submitContact(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      subject: formData.get("subject")?.toString() || "General Inquiry",
      message: formData.get("message")?.toString() || "",
    };

    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    const rateCheck = rateLimit(`contact:${ip}`, 3, 60 * 1000);
    if (!rateCheck.success) {
      throw new RateLimitError("Too many submissions. Please wait a minute before trying again.");
    }

    const result = contactSchema.safeParse(rawData);
    if (!result.success) {
      throw new ValidationError("Validation failed. Please check your inputs.", result.error.flatten().fieldErrors);
    }

    const data = result.data;
    logger.info("Contact form submission received", { name: data.name, email: data.email, subject: data.subject });

    return {
      success: true as const,
      message: "Thank you for reaching out! We'll get back to you shortly.",
    };
  } catch (error) {
    logger.warn("Contact form submission error", { error });
    return formatErrorResponse(error);
  }
}
