import { FeatureCollection } from "geojson";
import { useEffect, useState } from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import { LegendControl } from "./components/pm25legend.tsx";
import "./MapPm25.css";
import { Enriched, getEnrichedData } from "./utils/enrichData";

export default function MapAQI() {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [pm25Map, setpm25Map] = useState<
    Record<string, { count: number; total: number }>
  >({});

  useEffect(() => {
    async function fetchData() {
      const enriched = await getEnrichedData(
        "/data/points2.txt",
        "/malaysia.district.geojson",
        "enrichedpm25",
      );
      const aqiMap = computePm25Map(enriched);
      setpm25Map(aqiMap);
    }

    fetchData();
  }, []);

  useEffect(() => {
    fetch("/malaysia.district.geojson")
      .then((res) => res.json())
      .then(setGeoData)
      .catch(console.error);
  }, []);

  function style(feature: GeoJSON.Feature | undefined) {
    if (!feature || !feature.properties) return {};
    const name =
      feature.properties.name ||
      feature.properties.district ||
      feature.properties.city ||
      "";

    const entry = pm25Map[name];
    const avg = entry ? entry.total / entry.count : 0;

    return {
      fillColor: getColor(avg),
      weight: 1,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  }

  return (
    <MapContainer
      center={[3.139, 101.6869]}
      zoom={6}
      scrollWheelZoom
      className="h-screen"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geoData && <GeoJSON data={geoData} style={style} />}
      <LegendControl></LegendControl>
    </MapContainer>
  );
}

function getColor(pm25: number): string {
  if (pm25 > 350.4) return "#7E0023"; // Hazardous (401–500)
  if (pm25 > 250.4) return "#660099"; // Hazardous (301–400)
  if (pm25 > 150.4) return "#99004C"; // Very Unhealthy (201–300)
  if (pm25 > 55.4) return "#CC0033"; // Unhealthy (151–200)
  if (pm25 > 35.4) return "#FF9933"; // Unhealthy for Sensitive Groups (101–150)
  if (pm25 > 12.0) return "#FFDE33"; // Moderate (51–100)
  return "#009966"; // Good (0–50)
}

function computePm25Map(
  enriched: Enriched[],
): Record<string, { count: number; total: number }> {
  const map: Record<string, { count: number; total: number }> = {};
  for (const { district, state, aqi } of enriched) {
    const key = district || state;
    if (!key) continue;
    if (!map[key]) map[key] = { count: 0, total: 0 };
    map[key].count++;
    map[key].total += aqi;
  }
  return map;
}
