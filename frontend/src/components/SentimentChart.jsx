import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#00C49F', '#FF8042'];

export default function SentimentChart({ score }) {
  if (score === undefined || score === null) return <div className="text-gray-500">No sentiment data</div>;
  const chartData = [
    { label: 'Positive', value: score },
    { label: 'Other', value: 1 - score }
  ];
  return (
    <div className="bg-white rounded shadow p-4">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={60} label>
            {chartData.map((entry, index) => (
              <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
