import React, { useState } from "react";
import Pagination from "./Pagination";

const ProductTable = ({ data }) => {
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
            <th>Store</th>
            <th className="text-right">Online Sales</th>
            <th className="text-right">Offline Sales</th>
            <th className="text-right">Online %</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, idx) => {
            const totalSales = (row.online_sales_amount || 0) + (row.offline_sales_amount || 0);
            const onlinePercent = totalSales > 0 
              ? ((row.online_sales_amount / totalSales) * 100).toFixed(1)
              : 0;

            return (
              <tr key={startIndex + idx}>
                <td>{row.store}</td>
                <td className="text-right" style={{ color: '#4a90e2', fontWeight: 600 }}>
                  ₹{(row.online_sales_amount / 10000000).toFixed(2)} Cr
                </td>
                <td className="text-right" style={{ color: '#52c41a', fontWeight: 600 }}>
                  ₹{(row.offline_sales_amount / 10000000).toFixed(2)} Cr
                </td>
                <td className="text-right">
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    backgroundColor: onlinePercent > 50 ? '#e6f7ff' : '#f6ffed',
                    color: onlinePercent > 50 ? '#4a90e2' : '#52c41a',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '13px'
                  }}>
                    {onlinePercent}%
                  </div>
                </td>
                <td className="text-right" style={{ fontWeight: 600 }}>
                  ₹{(totalSales / 10000000).toFixed(2)} Cr
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

export default ProductTable;