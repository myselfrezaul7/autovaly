import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/content";

export async function GET() {
  const articles = getAllArticles();
  
  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Autovaly — Drive the Story</title>
    <link>https://autovaly.com</link>
    <description>Your definitive source for car news, EV reviews, comparisons, and automotive industry trends.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://autovaly.com/feed.xml" rel="self" type="application/rss+xml"/>
    ${articles.map(article => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>https://autovaly.com/articles/${article.slug}</link>
      <guid isPermaLink="true">https://autovaly.com/articles/${article.slug}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${article.excerpt}]]></description>
      <author>${article.author.name}</author>
      <category>${article.category}</category>
    </item>
    `).join('')}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      "Content-Type": "text/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
