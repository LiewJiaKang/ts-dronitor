import { Control, DomUtil } from "leaflet";
import { createControlComponent } from "@react-leaflet/core";

function getColor(aqi: number): string {
  if (aqi > 300) return "#7E0023";
  if (aqi > 200) return "#8F3F97";
  if (aqi > 150) return "#FF0000";
  if (aqi > 100) return "#FF7E00";
  if (aqi > 50) return "#FFFF00";
  return "#00E400";
}

const Legend = Control.extend({
  onAdd: function () {
    const div = DomUtil.create("div");
    div.className =
      "bg-background text-sm text-muted-foreground dark:text-white rounded-md shadow-md p-4 space-y-1";

    const ranges = [
      { label: "0–50 (Good)", value: 0 },
      { label: "51–100 (Moderate)", value: 51 },
      { label: "101–150 (Unhealthy for Sensitive Groups)", value: 101 },
      { label: "151–200 (Unhealthy)", value: 151 },
      { label: "201–300 (Very Unhealthy)", value: 201 },
      { label: "301–500 (Hazardous)", value: 301 },
    ];

    div.innerHTML =
      `<div class="font-semibold mb-1">AQI (Air Quality Index)</div>` +
      ranges
        .map(
          (r) => `
          <div class="flex items-center gap-2">
            <span class="inline-block w-3 h-3 rounded-sm" style="background:${getColor(
              r.value,
            )};"></span>
            <span>${r.label}</span>
          </div>`,
        )
        .join("");

    return div;
  },
  onRemove: function () {},
});

export const LegendControl = createControlComponent(
  () => new Legend({ position: "bottomright" }),
);
