import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function EmotionChart({ data }) {
  if (!data || Object.keys(data).length === 0) return <div className="text-gray-500">No emotion data</div>;
  const chartData = Object.entries(data).map(([label, score]) => ({ label, score }));
  return (
    <div className="bg-white rounded shadow p-4">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
