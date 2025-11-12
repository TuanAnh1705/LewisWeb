"use client";

import * as React from "react";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

// Dữ liệu giả
const chartData = [
  { source: "google", visitors: 275, fill: "var(--color-google)" },
  { source: "facebook", visitors: 200, fill: "var(--color-facebook)" },
  { source: "github", visitors: 187, fill: "var(--color-github)" },
  { source: "other", visitors: 130, fill: "var(--color-other)" }
];

// Cấu hình biểu đồ
const chartConfig = {
  visitors: {
    label: "Khách truy cập"
  },
  google: {
    label: "Google",
    color: "#4285F4"
  },
  facebook: {
    label: "Facebook",
    color: "#1877F2"
  },
  github: {
    label: "GitHub",
    color: "#171515"
  },
  other: {
    label: "Other",
    color: "#60A5FA"
  }
} satisfies ChartConfig;

export function SourcePieChart() {
  return (
    <Card>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="visitors" nameKey="source" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}