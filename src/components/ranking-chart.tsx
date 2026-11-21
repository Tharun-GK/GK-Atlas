"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function RankingChart({ data }: { data: { name:string; score:number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left:20, right:20 }}>
        <CartesianGrid stroke="#202737" horizontal={false} />
        <XAxis type="number" stroke="#7d8799" domain={[0,100]} />
        <YAxis type="category" dataKey="name" stroke="#9aa4b5" width={120} />
        <Tooltip contentStyle={{ background:"#111723", border:"1px solid #202737", borderRadius:8 }} />
        <Bar dataKey="score" fill="#91a9ed" radius={[0,5,5,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
