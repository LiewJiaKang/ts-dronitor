import { FeatureCollection } from "geojson";
import { useEffect, useState } from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import { LegendControl } from "./components/aqilegend.tsx";
import "./MapAQI.css";
import { Enriched, getEnrichedData } from "./utils/enrichData";

export default function MapAQI() {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [aqiMap, setAqiMap] = useState<
    Record<string, { count: number; total: number }>
  >({});

  useEffect(() => {
    async function fetchData() {
      const enriched = await getEnrichedData(
        "/data/points.txt",
        "/malaysia.district.geojson",
        "enrichedaqi",
      );
      const aqiMap = computeAqiMap(enriched);
      setAqiMap(aqiMap);
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

    const entry = aqiMap[name];
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
      <LegendControl />
    </MapContainer>
  );
}

function getColor(aqi: number): string {
  if (aqi > 300) return "#7E0023"; // Hazardous
  if (aqi > 200) return "#8F3F97"; // Very Unhealthy
  if (aqi > 150) return "#FF0000"; // Unhealthy
  if (aqi > 100) return "#FF7E00"; // Unhealthy for Sensitive Groups
  if (aqi > 50) return "#FFFF00"; // Moderate
  return "#00E400"; // Good
}

function computeAqiMap(
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
