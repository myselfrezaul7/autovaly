export interface ItemListElement {
  position: number;
  name: string;
  url: string;
}

export default function ItemListJsonLd({ items }: { items: ItemListElement[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url.startsWith("/") ? `https://autovaly.com${item.url}` : item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
