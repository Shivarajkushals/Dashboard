import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ReturnsChart = ({ data }) => {
  // Aggregate data by tran_type
  const tranTypeData = data.reduce((acc, row) => {
    const tranType = row.tran_type || 'Unknown';
    const revenue = row.current_sales || 0;
    
    if (!acc[tranType]) {
      acc[tranType] = 0;
    }
    acc[tranType] += revenue;
    
    return acc;
  }, {});

  // Convert to array format for pie chart
  const chartData = Object.entries(tranTypeData).map(([name, value]) => ({
    name: name,
    value: value,
    displayValue: `₹${(value / 10000000).toFixed(2)} Cr`
  }));

  // Sort by value (highest first)
  chartData.sort((a, b) => b.value - a.value);

  // Colors for different transaction types
  const COLORS = ['#4a90e2', '#52c41a', '#ff7300', '#ef4444', '#8b5cf6', '#f59e0b'];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = chartData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px 16px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px', marginBottom: '6px' }}>
            {payload[0].name}
          </p>
          <p style={{ margin: '4px 0', color: '#1a1a1a', fontSize: '13px' }}>
            Revenue: <strong>{payload[0].payload.displayValue}</strong>
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
            Share: <strong>{percentage}%</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label for pie slices
  const renderLabel = (entry) => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    const percentage = ((entry.value / total) * 100).toFixed(1);
    return `${percentage}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={renderLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value, entry) => `${value}: ${entry.payload.displayValue}`}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ReturnsChart;