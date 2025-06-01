import { Control, DomUtil } from "leaflet";
import { createControlComponent } from "@react-leaflet/core";

function getColor(pm25: number): string {
  if (pm25 > 350.4) return "#7E0023";
  if (pm25 > 250.4) return "#660099";
  if (pm25 > 150.4) return "#99004C";
  if (pm25 > 55.4) return "#CC0033";
  if (pm25 > 35.4) return "#FF9933";
  if (pm25 > 12.0) return "#FFDE33";
  return "#009966";
}

const Legend = Control.extend({
  onAdd: function () {
    const div = DomUtil.create("div");

    // Tailwind-based classes
    div.className =
      "bg-background text-sm text-muted-foreground dark:text-white rounded-md shadow-md p-4 space-y-1";

    const ranges = [
      { label: "0–12.0 (Good)", value: 0 },
      { label: "12.1–35.4 (Moderate)", value: 12.1 },
      { label: "35.5–55.4 (Unhealthy for Sensitive Groups)", value: 35.5 },
      { label: "55.5–150.4 (Unhealthy)", value: 55.5 },
      { label: "150.5–250.4 (Very Unhealthy)", value: 150.5 },
      { label: "250.5–350.4 (Hazardous)", value: 250.5 },
      { label: "350.5+ (Hazardous)", value: 350.5 },
    ];

    div.innerHTML =
      `<div class="font-semibold mb-1">NO₂ (µg/m³)</div>` +
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
