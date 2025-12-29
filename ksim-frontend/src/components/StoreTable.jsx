import React, { useState } from "react";
import Pagination from "./Pagination";

const StoreTable = ({ data, selectedStore, onRowClick }) => {
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
      setCurrentPage(1); // Reset to first page when changing items per page
    } else {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <table className="modern-table">
        <thead>
          <tr>
            <th>Market</th>
            <th className="text-right">Revenue</th>
            <th className="text-right">Bill Count</th>
            <th className="text-right">Conversion</th>
            <th className="text-right">Growth %</th>
            <th className="text-right">Total Qty</th>
            <th className="text-right">ASP</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, idx) => {
            const isSelected = selectedStore === row.store;
            
            return (
              <tr 
                key={startIndex + idx}
                onClick={() => onRowClick(row.store)}
                className={isSelected ? 'selected' : ''}
              >
                <td>
                  {isSelected && '👉 '}
                  {row.store}
                </td>
                <td className="text-right">
                  ₹{(row.current_sales / 10000000).toFixed(1)} Cr {row.current_sales >= row.last_year_sales ? '▲' : '▼'}
                </td>
                <td className="text-right">
                  {row.total_bills?.toLocaleString('en-IN')}
                </td>
                <td className="text-right">
                  {row.units_per_transaction ? `${row.units_per_transaction}%` : '-'}
                </td>
                <td className={`text-right ${row.growth_percent >= 0 ? 'growth-positive' : 'growth-negative'}`}>
                  {row.growth_percent >= 0 ? '▲' : '▼'} {Math.abs(row.growth_percent)}%
                </td>
                <td className="text-right">
                  {row.total_qty?.toLocaleString('en-IN')}
                </td>
                <td className="text-right">
                  ₹{row.avg_selling_price?.toLocaleString('en-IN')}
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

export default StoreTable;