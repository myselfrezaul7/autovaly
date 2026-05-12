export default function JsonLd() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Autovaly",
    url: "https://autovaly.com",
    description: "Your definitive source for car news, EV reviews, comparisons, and automotive industry trends.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://autovaly.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Autovaly",
    url: "https://autovaly.com",
    logo: "https://autovaly.com/og-image.png",
    sameAs: [
      "https://twitter.com/autovaly",
      "https://instagram.com/autovaly",
      "https://youtube.com/@autovaly",
      "https://facebook.com/autovaly",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
    </>
  );
}
