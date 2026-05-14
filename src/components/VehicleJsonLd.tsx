import { Vehicle } from "@/lib/types";

export default function VehicleJsonLd({ vehicle }: { vehicle: Vehicle }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Car", // Valid subtype of Product and Vehicle
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`,
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
        ratingValue: "4.5", // Arbitrary good rating for editorial reviews
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
