import { client } from "@/sanity/client";
import { logger } from "@/lib/logger";

export async function fetchSanityData<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = []
): Promise<T | null> {
  const isSanityConfigured =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "your-project-id";

  if (!isSanityConfigured) {
    return null;
  }

  try {
    const data = await client.fetch<T>(query, params, {
      next: {
        revalidate: 3600,
        tags,
      },
    });
    return data;
  } catch (error) {
    logger.error("Sanity CMS query error", { query, params, error });
    return null;
  }
}
