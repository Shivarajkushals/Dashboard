import React, { useState } from "react";
import Pagination from "./Pagination";

const ShopTypeTable = ({ data, selectedShopType, onRowClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page, newItemsPerPage) => {
    if (newItemsPerPage) {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <table className="modern-table">
        <thead>
          <tr>
            <th>Shop Type</th>
            <th className="text-right">Revenue</th>
            <th className="text-right">Bill Count</th>
            <th className="text-right">Growth %</th>
            <th className="text-right">Total Qty</th>
            <th className="text-right">Stores</th>
            <th className="text-right">ASP</th>
            <th className="text-right">UPT</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, idx) => {
            const isSelected = selectedShopType === row.shop_type;
            
            return (
              <tr 
                key={startIndex + idx}
                onClick={() => onRowClick(row.shop_type)}
                className={isSelected ? 'selected' : ''}
              >
                <td>
                  {isSelected && '👉 '}
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    backgroundColor: row.shop_type === 'Offline' ? '#f6ffed' : '#e6f7ff',
                    color: row.shop_type === 'Offline' ? '#52c41a' : '#4a90e2',
                    fontWeight: 600,
                    fontSize: '13px'
                  }}>
                    {row.shop_type === 'Offline' ? '🏪' : '🌐'} {row.shop_type}
                  </span>
                </td>
                <td className="text-right">
                  ₹{(row.current_sales / 10000000).toFixed(1)} Cr {row.current_sales >= row.last_year_sales ? '▲' : '▼'}
                </td>
                <td className="text-right">
                  {Math.round(row.total_bills).toLocaleString('en-IN')}
                </td>
                <td className={`text-right ${row.growth_percent >= 0 ? 'growth-positive' : 'growth-negative'}`}>
                  {row.growth_percent >= 0 ? '▲' : '▼'} {Math.abs(row.growth_percent)}%
                </td>
                <td className="text-right">
                  {Math.round(row.total_qty).toLocaleString('en-IN')}
                </td>
                <td className="text-right">
                  {row.store_count} stores
                </td>
                <td className="text-right">
                  ₹{parseFloat(row.avg_selling_price).toLocaleString('en-IN')}
                </td>
                <td className="text-right">
                  {parseFloat(row.units_per_transaction).toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={data.length}
      />
    </div>
  );
};

export default ShopTypeTable;