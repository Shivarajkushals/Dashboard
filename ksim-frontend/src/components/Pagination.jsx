import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Show max 5 page numbers at a time
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }
    
    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '20px',
      padding: '15px 0',
      borderTop: '1px solid #e0e0e0'
    }}>
      {/* Items info */}
      <div style={{ fontSize: '14px', color: '#666' }}>
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{totalItems}</strong> items
      </div>

      {/* Pagination buttons */}
      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '8px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            background: currentPage === 1 ? '#f5f5f5' : 'white',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            color: currentPage === 1 ? '#ccc' : '#666',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.target.style.background = '#f5f5f5';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.target.style.background = 'white';
            }
          }}
        >
          ← Previous
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} style={{ padding: '8px', color: '#999' }}>
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              style={{
                padding: '8px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                background: currentPage === page ? '#4a90e2' : 'white',
                color: currentPage === page ? 'white' : '#666',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: currentPage === page ? '600' : '400',
                minWidth: '40px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== page) {
                  e.target.style.background = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== page) {
                  e.target.style.background = 'white';
                }
              }}
            >
              {page}
            </button>
          )
        ))}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            background: currentPage === totalPages ? '#f5f5f5' : 'white',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            color: currentPage === totalPages ? '#ccc' : '#666',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.target.style.background = '#f5f5f5';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.target.style.background = 'white';
            }
          }}
        >
          Next →
        </button>
      </div>

      {/* Items per page selector */}
      <div style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>Show:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onPageChange(1, parseInt(e.target.value))}
          style={{
            padding: '6px 10px',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            background: 'white'
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span>per page</span>
      </div>
    </div>
  );
};

export default Pagination;