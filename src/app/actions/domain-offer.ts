"use server";

import { domainOfferSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { formatErrorResponse, RateLimitError } from "@/lib/errors";
import { headers } from "next/headers";

const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY ||
  process.env.WEB3FORMS_KEY ||
  "3281e53d-d6de-433b-ac48-98dc9f829145";

export async function submitDomainOffer(formData: FormData) {
  try {
    const honeypot = formData.get("_hp_domain_offer")?.toString();
    if (honeypot && honeypot.trim().length > 0) {
      logger.warn("Security warning: Bot detected via domain offer honeypot (_hp_domain_offer)", { honeypot });
      return { success: true as const, botBlocked: true as const };
    }

    const rawData = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      offerAmount: (formData.get("offerAmount") || formData.get("offer_amount"))?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      message: formData.get("message")?.toString() || "",
    };

    // Rate limiting by IP (5 attempts per minute)
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    const rateCheck = rateLimit(`domain-offer:${ip}`, 5, 60 * 1000);
    if (!rateCheck.success) {
      throw new RateLimitError("Too many offer submissions. Please wait a minute before submitting again.");
    }

    // Validate payload
    const result = domainOfferSchema.safeParse(rawData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors).flat()[0] || "Invalid domain offer data";
      return {
        success: false as const,
        error: firstError,
        errors: fieldErrors,
      };
    }

    const { name, email, offerAmount, phone, message } = result.data;

    const formattedMessage = [
      "Autovaly Domain Acquisition Proposal",
      "==================================",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      `Offer Amount: ${offerAmount}`,
      `Timestamp: ${new Date().toISOString()}`,
      "",
      "Notes / Proposed Terms:",
      message || "No additional notes provided.",
    ].join("\n");

    logger.info("Domain offer validated for Web3Forms dispatch", { name, email, offerAmount });

    return {
      success: true as const,
      web3Payload: {
        access_key: WEB3FORMS_KEY,
        name,
        email,
        from_name: `Autovaly Domain Acquisition: ${name}`,
        subject: `[Autovaly Domain Acquisition] Offer: ${offerAmount} from ${name}`,
        message: formattedMessage,
        botcheck: "",
      },
      message: "Your domain acquisition offer has been submitted successfully. Our team will review your proposal and respond promptly.",
    };
  } catch (error) {
    logger.warn("Domain offer submission error", { error });
    return formatErrorResponse(error);
  }
}
