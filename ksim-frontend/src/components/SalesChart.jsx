import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts";

const SalesChart = ({ data, selectedStore, onStoreClick }) => {
  // Handle bar click
  const handleBarClick = (entry) => {
    if (entry && entry.store) {
      // If clicking the already selected store, deselect it
      if (selectedStore === entry.store) {
        onStoreClick(null);
      } else {
        onStoreClick(entry.store);
      }
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <XAxis 
            dataKey="store" 
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            label={{ value: 'Sales Amount', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div 
                    style={{
                      backgroundColor: 'white',
                      padding: '12px',
                      border: '1px solid #ccc',
                      borderRadius: '6px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>
                      {payload[0].payload.store}
                    </p>
                    <p style={{ margin: '8px 0 0 0', color: '#8884d8', fontSize: '13px' }}>
                      Current Sales: ₹{payload[0].value?.toLocaleString('en-IN')}
                    </p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
                      💡 Click to filter
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="current_sales" 
            onClick={handleBarClick}
            style={{ cursor: 'pointer' }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={selectedStore === entry.store ? '#ff7300' : '#8884d8'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Filter Badge */}
      {selectedStore && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px 15px', 
          backgroundColor: '#ff7300',
          color: 'white',
          borderRadius: '6px',
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <span>📍 Filtered by: <strong>{selectedStore}</strong></span>
          <button
            onClick={() => onStoreClick(null)}
            style={{
              marginLeft: '12px',
              padding: '4px 10px',
              backgroundColor: 'white',
              color: '#ff7300',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '12px'
            }}
          >
            ✕ Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default SalesChart;