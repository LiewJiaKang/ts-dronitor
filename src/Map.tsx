import { MapContainer, Marker, TileLayer } from "react-leaflet";
import HeatmapLayer from "react-leaflet-heat-layer";
import addressPoints from "./data.ts";
import "./Map.css";

function MapApp() {
  return (
    <MapContainer
      center={[1.50928, 103.851718]}
      zoom={13}
      scrollWheelZoom={true}
      className="h-screen"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[1.50928, 103.851718]}></Marker>
      <HeatmapLayer latlngs={addressPoints.map((p) => [p[0], p[1]])} />
    </MapContainer>
  );
}

export default MapApp;
