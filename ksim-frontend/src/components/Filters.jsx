import React, { useState } from "react";

const Filters = ({ filters, setFilters, stores = [], TranTypes = [], ShopType = [] }) => {
  // Local state for ALL filters - only update parent on button click
  const [localFilters, setLocalFilters] = useState(filters);
  const [hasChanges, setHasChanges] = useState(false);

  const getYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  };

  // Track changes in local state
  const handleFilterChange = (key, value) => {
    setLocalFilters({ ...localFilters, [key]: value });
    setHasChanges(true);
  };

  // Apply filters when button is clicked
  const handleApplyFilters = () => {
    setFilters(localFilters);
    setHasChanges(false);
  };

  // Reset to default
  const handleReset = () => {
    const defaultFilters = {
      store: "",
      ShopType: "",
      TranType: "",
      fromDate: localFilters.fromDate,
      toDate: localFilters.toDate,
    };
    setLocalFilters(defaultFilters);
    setFilters(defaultFilters);
    setHasChanges(false);
  };

  // Allow Enter key to apply filters
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  return (
    <div className="mb-5">
      <div className="filters-container w-full">
        <div className="grid grid-cols-5 gap-4 w-full">
          <div className="filter-group">
            <label className="filter-label">From Date</label>
            <input
              type="date"
              min="2022-04-01"
              max={getYesterday()}
              value={localFilters.fromDate}
              onChange={(e) => handleFilterChange('fromDate', e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">To Date</label>
            <input
              type="date"
              min="2022-04-01"
              max={getYesterday()}
              value={localFilters.toDate}
              onChange={(e) => handleFilterChange('toDate', e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Store</label>
            <select
              value={localFilters.store}
              onChange={(e) => handleFilterChange('store', e.target.value)}
            >
              <option value="">All Stores</option>
              {stores.map((s, index) => (
                <option key={index} value={s.store}>
                  {s.store}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Shop Type</label>
            <select
              value={localFilters.ShopType}
              onChange={(e) => handleFilterChange('ShopType', e.target.value)}
            >
              <option value="">All Shop Types</option>
              {ShopType.map((s, index) => (
                <option key={index} value={s.shop_type}>
                  {s.shop_type}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Transaction Type</label>
            <select
              value={localFilters.TranType}
              onChange={(e) => handleFilterChange('TranType', e.target.value)}
            >
              <option value="">All Transaction Types</option>
              {TranTypes.map((s, index) => (
                <option key={index} value={s.tran_type}>
                  {s.tran_type}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">From Date</label>
            <input
              type="date"
              min="2022-04-01"
              max={getYesterday()}
              value={localFilters.fromDate}
              onChange={(e) => handleFilterChange('fromDate', e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">To Date</label>
            <input
              type="date"
              min="2022-04-01"
              max={getYesterday()}
              value={localFilters.toDate}
              onChange={(e) => handleFilterChange('toDate', e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Store</label>
            <select
              value={localFilters.store}
              onChange={(e) => handleFilterChange('store', e.target.value)}
            >
              <option value="">All Stores</option>
              {stores.map((s, index) => (
                <option key={index} value={s.store}>
                  {s.store}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Shop Type</label>
            <select
              value={localFilters.ShopType}
              onChange={(e) => handleFilterChange('ShopType', e.target.value)}
            >
              <option value="">All Shop Types</option>
              {ShopType.map((s, index) => (
                <option key={index} value={s.shop_type}>
                  {s.shop_type}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Transaction Type</label>
            <select
              value={localFilters.TranType}
              onChange={(e) => handleFilterChange('TranType', e.target.value)}
            >
              <option value="">All Transaction Types</option>
              {TranTypes.map((s, index) => (
                <option key={index} value={s.tran_type}>
                  {s.tran_type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="filter-group">
          <button
            onClick={handleApplyFilters}
            style={{
              padding: '10px 24px',
              backgroundColor: hasChanges ? '#4a90e2' : '#e0e0e0',
              color: hasChanges ? 'white' : '#999',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: hasChanges ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              boxShadow: hasChanges ? '0 2px 8px rgba(74, 144, 226, 0.3)' : 'none'
            }}
            disabled={!hasChanges}
            onMouseEnter={(e) => {
              if (hasChanges) {
                e.target.style.backgroundColor = '#357abd';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (hasChanges) {
                e.target.style.backgroundColor = '#4a90e2';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            🔍 Apply Filters
          </button>

          <button
            onClick={handleReset}
            style={{
              padding: '10px 20px',
              backgroundColor: 'white',
              color: '#666',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f5f5f5';
              e.target.style.borderColor = '#999';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.borderColor = '#e0e0e0';
            }}
          >
            🔄 Reset
          </button>
        </div>

        {/* Hint text */}
      </div>
      <div className="flex justify-end">
        <div className={`text-[#ff7300] text-xs pt-2 ${hasChanges ? 'visible' : 'invisible'}`}>
          💡 You have unsaved filter changes. Click "Apply Filters" to update.
        </div>
      </div>
    </div >
  );
};

export default Filters;