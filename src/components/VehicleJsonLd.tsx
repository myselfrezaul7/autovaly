import { Vehicle } from "@/lib/types";

export default function VehicleJsonLd({ vehicle }: { vehicle: Vehicle }) {
  const prosCount = vehicle.prosAndCons.pros.length;
  const consCount = vehicle.prosAndCons.cons.length;
  const calculatedRating = Math.min(5, Math.max(3, 3.5 + (prosCount * 0.5) - (consCount * 0.3))).toFixed(1);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`,
    image: vehicle.coverImage
      ? (vehicle.coverImage.startsWith("/") ? `https://autovaly.com${vehicle.coverImage}` : vehicle.coverImage)
      : "https://autovaly.com/og-image.png",
    brand: {
      "@type": "Brand",
      name: vehicle.make,
    },
    model: vehicle.model,
    vehicleModelDate: vehicle.year.toString(),
    bodyType: vehicle.bodyStyle,
    fuelType: vehicle.fuelType,
    driveWheelConfiguration: vehicle.specs.drivetrain,
    vehicleEngine: {
      "@type": "EngineSpecification",
      enginePower: {
        "@type": "QuantitativeValue",
        value: vehicle.specs.powerHp,
        unitCode: "BHP",
      },
    },
    speed: {
      "@type": "QuantitativeValue",
      value: vehicle.specs.topSpeedKmh,
      unitCode: "KMH",
    },
    offers: {
      "@type": "Offer",
      price: vehicle.priceEur,
      priceCurrency: "EUR",
      url: `https://autovaly.com/vehicles/${vehicle.slug}`,
      availability: "https://schema.org/InStock",
    },
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: calculatedRating,
        bestRating: "5",
      },
      author: {
        "@type": "Organization",
        name: "Autovaly Editorial",
      },
      reviewBody: `Pros: ${vehicle.prosAndCons.pros.join(", ")}. Cons: ${vehicle.prosAndCons.cons.join(", ")}.`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
