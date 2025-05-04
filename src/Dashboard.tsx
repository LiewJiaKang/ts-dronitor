import OpenAI from "openai";
import geojsonData from "/malaysia.district.geojson?url";
import pointsUrl from "/data/points.txt?url";
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
import { useEffect, useState } from "react";
import { AQIBarChart } from "./components/aqi-chart";
import { getEnrichedData, Enriched } from "./utils/enrichData";

export default function Dashboard() {
  const [response, setResponse] = useState<string>("");
  const [prompting, setPrompting] = useState<boolean>(false);
  const [enriched, setEnriched] = useState<Enriched[]>([]);

  const client = new OpenAI({
    apiKey: import.meta.env.VITE_AI_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    async function fetchAndPrompt() {
      const data = await getEnrichedData(pointsUrl, geojsonData);
      setEnriched(data);

      if (response || prompting) return;
      setPrompting(true);

      const prompt = `Analyze these Malaysia air-quality readings (lat, lon, aqi) with location names attached using tables (Important! You must use tables.) for "AI overview" for a dashboard. You do not need to provide any code examples or way to analyze the data. Start your response with a brief summary(with the title being the largest heading) of the data and then provide a detailed analysis of the air quality in each location.\n${JSON.stringify(data)}`;

      const completion = await client.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [{ role: "user", content: prompt }],
      });

      setResponse(
        completion.choices[0].message.content || "AI prompt not available",
      );
    }

    fetchAndPrompt();
  }, [client.chat.completions, prompting, response]);

  return (
    <div className="p-5">
      <div className="flex w-full gap-x-5 gap-y-5 flex-col md:flex-row">
        <AQIBarChart data={enriched} />
        <Card className="w-full h-[55vh] overflow-y-auto ">
          <CardHeader>
            <CardTitle>Raw data</CardTitle>
            <CardDescription>Data provided by the drone. </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lat</TableHead>
                  <TableHead>Long</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>AQI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enriched.map((p, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{p.lat}</TableCell>
                    <TableCell>{p.lon}</TableCell>
                    <TableCell>
                      {p.district === p.state
                        ? p.state
                        : `${p.district}, ${p.state}`}
                    </TableCell>
                    <TableCell>{p.aqi}</TableCell>
                  </TableRow>
                ))}
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
              <article className="prose prose-sm dark:prose-invert">
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
                <Skeleton key={i} className="h-4" />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
