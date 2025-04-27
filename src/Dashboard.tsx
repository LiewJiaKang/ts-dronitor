import OpenAI from "openai";
import points from "/data/points.txt?url";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Skeleton } from "./components/ui/skeleton";
import { useState } from "react";
import OpenCage from "opencage-api-client";
import { AQIBarChart } from "./components/aqi-chart";

type Record = { lat: number; lon: number; aqi: number };
type Enriched = Record & { state: string; district: string };

export default function Dashboard() {
  const [response, setResponse] = useState<string>("");
  const [prompting, setPrompting] = useState<boolean>(false);

  const client = new OpenAI({
    apiKey: import.meta.env.VITE_AI_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
    dangerouslyAllowBrowser: true,
  });

  async function getAIPrompt() {
    if (response || prompting) return;
    setPrompting(true); // Moved up early

    const cached = localStorage.getItem("enriched");
    let data: string;

    if (!cached) {
      const raw = await fetch(points).then((r) => r.text());

      const recs: Record[] = raw
        .trim()
        .split("\n")
        .map((line) => {
          const [lat, lon, aqi] = line.split(",").map((s) => s.trim());
          return { lat: +lat, lon: +lon, aqi: +aqi };
        });

      const enriched: Enriched[] = [];

      for (const { lat, lon, aqi } of recs) {
        try {
          const result = await OpenCage.geocode({
            key: import.meta.env.VITE_OPENCAGE_KEY,
            q: `${lat},${lon}`,
            no_annotations: 1,
            language: "en",
          });

          const comps = result.results[0]?.components || {};
          enriched.push({
            lat,
            lon,
            aqi,
            state: comps.state || "",
            district: comps.city || comps.town || comps.village || "",
          });

          // optional: small delay to avoid hitting rate limits
          await new Promise((r) => setTimeout(r, 200));
        } catch {
          enriched.push({ lat, lon, aqi, state: "", district: "" });
        }
      }

      localStorage.setItem("enriched", JSON.stringify(enriched, null, 2));
      data = JSON.stringify(enriched);
    } else {
      data = cached;
    }

    const prompt = `Analyze these Malaysia air-quality readings (lat, lon, aqi) with location names attached using tables (Important! You must use tables.) for "AI overview" for a dashboard. You do not need to provide any code examples or way to analyze the data.\n${data}`;

    const completion = await client.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [{ role: "user", content: prompt }],
    });

    setResponse(
      completion.choices[0].message.content || "AI prompt not available",
    );
  }

  useState(() => {
    getAIPrompt();
  });

  return (
    <div className="p-5">
      <div className="flex w-full gap-x-5 gap-y-5 flex-col md:flex-row">
        <AQIBarChart
          data={JSON.parse(localStorage.getItem("enriched") || "")}
        ></AQIBarChart>
        <Card className="w-full h-[55vh] overflow-y-auto ">
          <CardHeader>
            <CardTitle>Raw data</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableHead>Lat</TableHead>
                <TableHead>Long</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>AQI</TableHead>
              </TableHeader>
              <TableBody>
                {JSON.parse(localStorage.getItem("enriched") || "").map(
                  (p: {
                    lat: number;
                    lon: number;
                    aqi: number;
                    state: string;
                    district: string;
                  }) => (
                    <TableRow>
                      <TableCell>{p.lat}</TableCell>
                      <TableCell>{p.lon}</TableCell>
                      <TableCell>
                        {p.district == p.state
                          ? p.state
                          : p.district + ", " + p.state}
                      </TableCell>
                      <TableCell>{p.aqi}</TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>AI Overview</CardTitle>
          <CardDescription>
            Model: meta-llama/llama-4-scout-17b-16e-instruct
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {response ? (
              <article className="prose dark:prose-invert">
                <Markdown
                  components={{
                    table: ({ children }) => <Table>{children}</Table>,
                    thead: ({ children }) => (
                      <TableHeader>{children}</TableHeader>
                    ),
                    tbody: ({ children }) => <TableBody>{children}</TableBody>,
                    tr: ({ children }) => <TableRow>{children}</TableRow>,
                    th: ({ children }) => <TableHead>{children}</TableHead>,
                    td: ({ children }) => <TableCell>{children}</TableCell>,
                  }}
                  remarkPlugins={[remarkGfm]}
                >
                  {response.replace(/<think>.*?<\/think>/gs, "")}
                </Markdown>
              </article>
            ) : (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-[250px] bg-gray-400" />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
