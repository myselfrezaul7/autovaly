"use server";

import { domainOfferSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { formatErrorResponse, RateLimitError } from "@/lib/errors";
import { headers } from "next/headers";

const WEB3FORMS_API = "https://api.web3forms.com/submit";
const WEB3FORMS_KEY = process.env.WEB3FORMS_KEY || "3281e53d-d6de-433b-ac48-98dc9f829145";

export async function submitDomainOffer(formData: FormData) {
  try {
    const honeypot = formData.get("_hp_domain_offer")?.toString();
    if (honeypot && honeypot.trim().length > 0) {
      logger.warn("Security warning: Bot detected via domain offer honeypot (_hp_domain_offer)", { honeypot });
      return { success: true };
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

    // Forward to Web3Forms API
    const web3FormData = new FormData();
    web3FormData.append("access_key", WEB3FORMS_KEY);
    web3FormData.append("name", name);
    web3FormData.append("email", email);
    web3FormData.append("from_name", `Autovaly Domain Acquisition: ${name}`);
    web3FormData.append("subject", `[Autovaly Domain Acquisition] Offer: ${offerAmount} from ${name}`);

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

    web3FormData.append("message", formattedMessage);
    web3FormData.append("botcheck", "");

    const response = await fetch(WEB3FORMS_API, {
      method: "POST",
      body: web3FormData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      logger.warn("Web3Forms domain offer submission failed", { status: response.status, data });
      return {
        success: false as const,
        error: data.message || "Failed to submit domain offer. Please try again later.",
      };
    }

    logger.info("Domain offer submitted successfully", { name, email, offerAmount });

    return {
      success: true as const,
      message: "Your domain acquisition offer has been submitted successfully. Our team will review your proposal and respond promptly.",
    };
  } catch (error) {
    logger.warn("Domain offer submission error", { error });
    return formatErrorResponse(error);
  }
}
