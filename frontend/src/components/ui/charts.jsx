import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function BarChart({ data, xField, yField, color = '#8884d8', ...props }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data} {...props}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xField} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={yField} fill={color} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export function LineChart({ data, xField, yField, color = '#8884d8', ...props }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={data} {...props}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xField} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={yField}
          stroke={color}
          activeDot={{ r: 8 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export function PieChart({ data, nameField = 'name', valueField = 'value', ...props }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart {...props}>
        <Pie
          data={data}
          dataKey={valueField}
          nameKey={nameField}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
} 