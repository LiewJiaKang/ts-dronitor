import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";

const AQICategories = [
  { name: "(0-50)", range: [0, 50], color: "#00e400" },
  { name: "(51-100)", range: [51, 100], color: "#ffff00" },
  { name: "(101-150)", range: [101, 150], color: "#ff7e00" },
  { name: "(151-200)", range: [151, 200], color: "#ff0000" },
  { name: "(201-300)", range: [201, 300], color: "#8f3f97" },
  { name: "(301+)", range: [301, 500], color: "#7e0023" },
];

export function AQIBarChart({ data }: { data: { aqi: number }[] }) {
  const chartData = AQICategories.map((cat) => ({
    name: cat.name,
    count: data.filter((d) => d.aqi >= cat.range[0] && d.aqi <= cat.range[1])
      .length,
    color: cat.color,
  }));
  const chartConfig = {};

  return (
    <Card className="w-full h-[55vh] overflow-y-auto">
      <CardHeader>
        <CardTitle>AQI Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" style={{ fill: "currentColor" }} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
