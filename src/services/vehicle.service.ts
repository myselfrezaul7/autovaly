import { fetchSanityData } from "./sanity.service";
import { vehicles as mockVehicles } from "@/lib/data/vehicles";
import { Vehicle, FuelType, BodyStyle } from "@/lib/types";

const VEHICLE_GROQ_FIELDS = `
  _id,
  "id": _id,
  "slug": slug.current,
  make,
  model,
  year,
  trim,
  fuelType,
  bodyStyle,
  priceEur,
  priceUsd,
  specs,
  evSpecs,
  highlights,
  prosAndCons,
  coverGradient,
  "coverImage": coverImage.asset->url,
  segments,
  featured,
  new2025
`;

export async function getAllVehicles(): Promise<Vehicle[]> {
  const sanityVehicles = await fetchSanityData<Vehicle[]>(
    `*[_type == "vehicle"] | order(make asc) { ${VEHICLE_GROQ_FIELDS} }`,
    {},
    ["vehicles"]
  );

  if (sanityVehicles && sanityVehicles.length > 0) {
    return sanityVehicles;
  }

  return [...mockVehicles].sort((a, b) => a.make.localeCompare(b.make));
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | undefined> {
  const all = await getAllVehicles();
  return all.find((v) => v.slug === slug);
}

export async function getVehiclesByFuelType(fuelType: FuelType): Promise<Vehicle[]> {
  const all = await getAllVehicles();
  return all.filter((v) => v.fuelType === fuelType);
}

export async function getVehiclesByBodyStyle(bodyStyle: BodyStyle): Promise<Vehicle[]> {
  const all = await getAllVehicles();
  return all.filter((v) => v.bodyStyle === bodyStyle);
}

export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  const all = await getAllVehicles();
  return all.filter((v) => v.featured);
}

export async function getNew2025Vehicles(): Promise<Vehicle[]> {
  const all = await getAllVehicles();
  return all.filter((v) => v.new2025);
}

export function searchVehicles(query: string, vehiclesList: Vehicle[] = mockVehicles): Vehicle[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return vehiclesList.filter(
    (v) =>
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.trim.toLowerCase().includes(q) ||
      v.fuelType.toLowerCase().includes(q) ||
      v.bodyStyle.toLowerCase().includes(q) ||
      v.segments.some((s) => s.toLowerCase().includes(q)) ||
      v.year.toString().includes(q)
  );
}
