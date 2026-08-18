"use server";

import { contactSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { formatErrorResponse, ValidationError, RateLimitError } from "@/lib/errors";
import { headers } from "next/headers";

const WEB3FORMS_API = "https://api.web3forms.com/submit";
const WEB3FORMS_KEY = process.env.WEB3FORMS_KEY || "3281e53d-d6de-433b-ac48-98dc9f829145";

export async function submitContactForm(formData: FormData) {
  try {
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

    // Forward to Web3Forms
    const web3FormData = new FormData();
    web3FormData.append("access_key", WEB3FORMS_KEY);
    web3FormData.append("name", name);
    web3FormData.append("email", email);
    web3FormData.append("from_name", `Autovaly Reader: ${name}`);
    web3FormData.append("subject", `[Autovaly ${subject}] Message from ${name}`);
    web3FormData.append("message", `Name: ${name}\nEmail: ${email}\nTopic: ${subject}\n\nMessage:\n${message}\n\nSent: ${new Date().toISOString()}`);
    web3FormData.append("botcheck", "");

    const response = await fetch(WEB3FORMS_API, {
      method: "POST",
      body: web3FormData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      logger.warn("Web3Forms contact form submission failed", { status: response.status, data });
      return {
        success: false as const,
        error: data.message || "Failed to deliver message. Please try again later.",
      };
    }

    logger.info("Contact form submitted successfully", { name, email, subject });

    return {
      success: true as const,
      message: "Message delivered successfully! Our team will review your inquiry shortly.",
    };
  } catch (error) {
    logger.warn("Contact form submission error", { error });
    return formatErrorResponse(error);
  }
}
