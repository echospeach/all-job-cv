"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function SignupsChart({ data }: { data: { date: string; count: number }[] }) {
  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#D8D3C8" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#8B8578" }}
            tickFormatter={(value) => value.slice(5)}
            interval={4}
          />
          <YAxis tick={{ fontSize: 10, fill: "#8B8578" }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #D8D3C8" }}
          />
          <Bar dataKey="count" fill="#3F6C51" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
