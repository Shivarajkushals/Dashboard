import React, { useState } from "react";
import Pagination from "./Pagination";

const MonthOnMonthTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('sales'); // 'sales' or 'qty'

  // Debug logs
  console.log('MonthOnMonthTable received data:', data);

  if (!data) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
      Loading month-on-month data...
    </div>;
  }

  if (!data.months || !data.stores) {
    console.error('Invalid data structure:', data);
    return <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>
      Invalid data structure. Expected 'months' and 'stores' properties.
    </div>;
  }

  if (data.stores.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
      No data available for the selected date range.
    </div>;
  }

  const { months, stores } = data;

  // Calculate pagination
  const totalPages = Math.ceil(stores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStores = stores.slice(startIndex, endIndex);

  const handlePageChange = (page, newItemsPerPage) => {
    if (newItemsPerPage) {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
  };

  // Format month for display (Jan 2025)
  const formatMonth = (month) => {
    const [year, monthNum] = month.split('-');
    const date = new Date(year, monthNum - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Calculate total for a month
  const getMonthTotal = (monthIndex) => {
    return stores.reduce((sum, store) => {
      const value = viewMode === 'sales' 
        ? store.data[monthIndex]?.sales || 0
        : store.data[monthIndex]?.qty || 0;
      return sum + value;
    }, 0);
  };

  // Calculate total for a store
  const getStoreTotal = (store) => {
    return store.data.reduce((sum, monthData) => {
      const value = viewMode === 'sales' ? monthData.sales : monthData.qty;
      return sum + (value || 0);
    }, 0);
  };

  return (
    <div>
      {/* View Mode Toggle */}
      <div style={{ 
        marginBottom: '15px', 
        display: 'flex', 
        gap: '10px',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#666' }}>
          View:
        </span>
        <button
          onClick={() => setViewMode('sales')}
          style={{
            padding: '8px 16px',
            backgroundColor: viewMode === 'sales' ? '#4a90e2' : 'white',
            color: viewMode === 'sales' ? 'white' : '#666',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >
          💰 Total Sales
        </button>
        <button
          onClick={() => setViewMode('qty')}
          style={{
            padding: '8px 16px',
            backgroundColor: viewMode === 'qty' ? '#4a90e2' : 'white',
            color: viewMode === 'qty' ? 'white' : '#666',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >
          📦 Quantity Sold
        </button>
      </div>

      {/* Table with horizontal scroll */}
      <div style={{ overflowX: 'auto' }}>
        <table className="modern-table" style={{ minWidth: '800px' }}>
          <thead>
            <tr>
              <th style={{ position: 'sticky', left: 0, backgroundColor: '#f8f9fa', zIndex: 2 }}>
                Store
              </th>
              {months.map((month, idx) => (
                <th key={idx} className="text-right">
                  {formatMonth(month)}
                </th>
              ))}
              <th className="text-right" style={{ backgroundColor: '#fff3e0', fontWeight: '700' }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {currentStores.map((storeData, idx) => (
              <tr key={startIndex + idx}>
                <td style={{ 
                  position: 'sticky', 
                  left: 0, 
                  backgroundColor: 'white',
                  fontWeight: '600',
                  zIndex: 1
                }}>
                  {storeData.store}
                </td>
                {storeData.data.map((monthData, monthIdx) => {
                  const value = viewMode === 'sales' ? monthData.sales : monthData.qty;
                  const displayValue = viewMode === 'sales' 
                    ? `₹${(value / 10000000).toFixed(2)} Cr`
                    : value.toLocaleString('en-IN');
                  
                  return (
                    <td key={monthIdx} className="text-right" style={{
                      color: value > 0 ? '#1a1a1a' : '#ccc'
                    }}>
                      {value > 0 ? displayValue : '-'}
                    </td>
                  );
                })}
                <td className="text-right" style={{
                  backgroundColor: '#fff3e0',
                  fontWeight: '700',
                  color: '#ff7300'
                }}>
                  {viewMode === 'sales' 
                    ? `₹${(getStoreTotal(storeData) / 10000000).toFixed(2)} Cr`
                    : getStoreTotal(storeData).toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
            
            {/* Totals Row */}
            <tr style={{ 
              backgroundColor: '#f8f9fa', 
              fontWeight: '700',
              borderTop: '2px solid #e0e0e0'
            }}>
              <td style={{ 
                position: 'sticky', 
                left: 0, 
                backgroundColor: '#f8f9fa',
                zIndex: 1
              }}>
                Total
              </td>
              {months.map((month, idx) => {
                const total = getMonthTotal(idx);
                const displayValue = viewMode === 'sales' 
                  ? `₹${(total / 10000000).toFixed(2)} Cr`
                  : total.toLocaleString('en-IN');
                
                return (
                  <td key={idx} className="text-right" style={{ color: '#4a90e2' }}>
                    {displayValue}
                  </td>
                );
              })}
              <td className="text-right" style={{ 
                backgroundColor: '#4a90e2', 
                color: 'white' 
              }}>
                {viewMode === 'sales' 
                  ? `₹${(stores.reduce((sum, s) => sum + getStoreTotal(s), 0) / 10000000).toFixed(2)} Cr`
                  : stores.reduce((sum, s) => sum + getStoreTotal(s), 0).toLocaleString('en-IN')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={stores.length}
      />
    </div>
  );
};

export default MonthOnMonthTable;