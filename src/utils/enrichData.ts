import * as turf from "@turf/turf";
import type { FeatureCollection, Feature, Polygon } from "geojson";

export type Record = { lat: number; lon: number; aqi: number };
export type Enriched = Record & { state: string; district: string };
type GeoFeature = Feature<
  Polygon,
  { state?: string; district?: string; name?: string }
>;

export async function getEnrichedData(
  pointsUrl: string,
  geojsonUrl: string,
  storageKey: string,
): Promise<Enriched[]> {
  const cached = localStorage.getItem(storageKey);
  if (cached) {
    return JSON.parse(cached) as Enriched[];
  }

  const [rawPoints, geoData] = await Promise.all([
    fetch(pointsUrl).then((r) => r.text()),
    fetch(geojsonUrl).then(
      (r) =>
        r.json() as Promise<
          FeatureCollection<Polygon, GeoFeature["properties"]>
        >,
    ),
  ]);

  const recs: Record[] = rawPoints
    .trim()
    .split("\n")
    .map((line) => {
      const [lat, lon, aqi] = line.split(",").map((s) => parseFloat(s.trim()));
      return { lat, lon, aqi };
    });

  const enriched: Enriched[] = [];

  for (const { lat, lon, aqi } of recs) {
    const point = turf.point([lon, lat]);

    const match = geoData.features.find((feature) =>
      turf.booleanPointInPolygon(point, feature),
    );

    const state = match?.properties?.state || "";
    const district =
      match?.properties?.district || match?.properties?.name || "";

    enriched.push({ lat, lon, aqi, state, district });
  }

  localStorage.setItem(storageKey, JSON.stringify(enriched, null, 2));
  return enriched;
}
