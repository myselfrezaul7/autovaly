import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { revalidateSchema } from "@/lib/validators";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const authHeader = req.headers.get("x-sanity-secret") || body.secret;

    const validation = revalidateSchema.safeParse({
      secret: authHeader,
      tag: body.tag,
      path: body.path,
    });

    if (!validation.success) {
      logger.warn("Revalidation unauthorized or invalid params", { errors: validation.error.format() });
      return NextResponse.json({ error: "Invalid secret or parameters" }, { status: 401 });
    }

    const expectedSecret = process.env.SANITY_REVALIDATE_SECRET || "default_revalidate_secret";
    if (validation.data.secret !== expectedSecret) {
      logger.warn("Revalidation secret mismatch");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (validation.data.tag) {
      revalidateTag(validation.data.tag, "default");
      logger.info(`Revalidated tag: ${validation.data.tag}`);
    }

    if (validation.data.path) {
      revalidatePath(validation.data.path);
      logger.info(`Revalidated path: ${validation.data.path}`);
    }

    if (!validation.data.tag && !validation.data.path) {
      revalidateTag("articles", "default");
      revalidateTag("vehicles", "default");
      logger.info("Revalidated default tags (articles, vehicles)");
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    logger.error("Error in revalidate API route", { error });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
