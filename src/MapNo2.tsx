import { FeatureCollection } from "geojson";
import { useEffect, useState } from "react";
import { CircleMarker, GeoJSON, LayerGroup, LayersControl, MapContainer, TileLayer } from "react-leaflet";
const { BaseLayer } = LayersControl;
import { LegendControl } from "./components/No2legend.tsx";
import "./MapNo2.css";
import { Enriched, getEnrichedData } from "./utils/enrichData";


export default function MapNo2() {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [no2Map, setNo2Map] = useState<
    Record<string, { count: number; total: number }>
  >({});
  const [enrichedPoints, setEnrichedPoints] = useState<Enriched[]>([]);

  useEffect(() => {
    async function fetchData() {
      const enriched = await getEnrichedData(
        "/data/points2.txt",
        "/malaysia.district.geojson",
        "enrichedNo2",
      );
      const No2Map = computeNo2Map(enriched);
      setNo2Map(No2Map);
      setEnrichedPoints(enriched); // store point data for CircleMarkers
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

    const entry = no2Map[name];
    const avg = entry ? entry.total / entry.count : 0;

    return {
      fillColor: getNo2Color(avg),
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
      
<LayersControl position="topright">
        <BaseLayer name="Choropleth map" checked>
          {geoData && <GeoJSON data={geoData} style={style} />}
        </BaseLayer>

        <BaseLayer name="Discrete AQI Points">
        <LayerGroup>
            {enrichedPoints.map((point, idx) => (
              <CircleMarker
                key={idx}
                center={[point.lat, point.lon]}
                radius={6}
                fillColor={getNo2Color(point.aqi)}
                color={getNo2Color(point.aqi)}
                fillOpacity={0.7}
                stroke={false}
              >
              </CircleMarker>
            ))}
          </LayerGroup>
        </BaseLayer>
      </LayersControl>



      <LegendControl></LegendControl>
    </MapContainer>
  );
}


// NO2 (Nitrogen Dioxide) 1-hour mean (ppb) - Example breakpoints:
// 0-53: Good, 54-100: Moderate, 101-360: Unhealthy for Sensitive Groups, 361-649: Unhealthy, 650-1249: Very Unhealthy, 1250+: Hazardous
function getNo2Color(no2: number): string {
  if (no2 > 1249) return "#7E0023"; // Hazardous
  if (no2 > 649) return "#660099"; // Very Unhealthy
  if (no2 > 360) return "#CC0033"; // Unhealthy
  if (no2 > 100) return "#FF9933"; // Unhealthy for Sensitive Groups
  if (no2 > 53) return "#FFDE33"; // Moderate
  return "#009966"; // Good
}

function computeNo2Map(
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
