import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";
import { getEnrichedData, Enriched } from "./utils/enrichData";
import "./MapAQI.css";
import { FeatureCollection } from "geojson";

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
    </MapContainer>
  );
}

function getColor(aqi: number) {
  return aqi > 200
    ? "#800026"
    : aqi > 150
      ? "#BD0026"
      : aqi > 100
        ? "#E31A1C"
        : aqi > 50
          ? "#FC4E2A"
          : aqi > 25
            ? "#FD8D3C"
            : aqi > 10
              ? "#FEB24C"
              : "#FFEDA0";
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
