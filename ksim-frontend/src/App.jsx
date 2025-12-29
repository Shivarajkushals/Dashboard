import React, { useEffect, useState, useRef } from "react";
import { getStoreSummary, getShopTypeSummary, getMonthOnMonth, getStoreList, getTranTypeList, getShopTypeList } from "./api";
import Filters from "./components/Filters";
import StoreTable from "./components/StoreTable";
import ShopTypeTable from "./components/ShopTypeTable";
import ProductTable from "./components/ProductTable";
import MonthOnMonthTable from "./components/MonthOnMonthTable";
import SalesChart from "./components/SalesChart";
import ReturnsChart from "./components/ReturnsChart";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [shopTypeData, setShopTypeData] = useState([]);
  const [monthOnMonthData, setMonthOnMonthData] = useState(null);
  const [stores, setStores] = useState([]);
  const [TransType, setTranType] = useState([]);
  const [ShopType, setShopType] = useState([]);
  const [loading, setLoading] = useState(false);

  // Prevent duplicate calls in React StrictMode
  const fetchedRef = useRef({
    stores: false,
    tranTypes: false,
    shopTypes: false
  });

  const getYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  };

  const getFirstDateOfCurrentMonth = () => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split("T")[0];
  };

  const [filters, setFilters] = useState({
    store: "",
    ShopType: "",
    TranType: "",
    fromDate: getFirstDateOfCurrentMonth(),
    toDate: getYesterday(),
  });

  // Load dropdown data only once
  useEffect(() => {
    if (!fetchedRef.current.stores) {
      fetchedRef.current.stores = true;
      getStoreList().then((res) => setStores(res.data)).catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (!fetchedRef.current.tranTypes) {
      fetchedRef.current.tranTypes = true;
      getTranTypeList().then((res) => setTranType(res.data)).catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (!fetchedRef.current.shopTypes) {
      fetchedRef.current.shopTypes = true;
      getShopTypeList().then((res) => setShopType(res.data)).catch(console.error);
    }
  }, []);

  // Load data when filters change - NO DEBOUNCING needed with button
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [storeRes, shopTypeRes, momRes] = await Promise.all([
          getStoreSummary(filters),
          getShopTypeSummary(filters),
          getMonthOnMonth(filters)
        ]);
        console.log('Store data:', storeRes.data);
        console.log('Shop type data:', shopTypeRes.data);
        console.log('Month-on-Month data:', momRes.data);
        
        setData(storeRes.data);
        setShopTypeData(shopTypeRes.data);
        setMonthOnMonthData(momRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.fromDate, filters.toDate, filters.store, filters.ShopType, filters.TranType]);

  const handleStoreClick = (storeName) => {
    setFilters({ ...filters, store: storeName || "" });
  };

  const handleTableRowClick = (storeName) => {
    if (filters.store === storeName) {
      setFilters({ ...filters, store: "" });
    } else {
      setFilters({ ...filters, store: storeName });
    }
  };

  const handleShopTypeClick = (shopType) => {
    if (filters.ShopType === shopType) {
      setFilters({ ...filters, ShopType: "" });
    } else {
      setFilters({ ...filters, ShopType: shopType });
    }
  };

  // Calculate KPIs
  const totalRevenue = data.reduce((sum, row) => sum + (row.current_sales || 0), 0);
  const totalBills = data.reduce((sum, row) => sum + (row.total_bills || 0), 0);
  const totalQty = data.reduce((sum, row) => sum + (row.total_qty || 0), 0);
  const lastYearRevenue = data.reduce((sum, row) => sum + (row.last_year_sales || 0), 0);
  const avgGrowth = lastYearRevenue > 0 
    ? ((totalRevenue - lastYearRevenue) / lastYearRevenue * 100).toFixed(1)
    : 0;
  
  const onlineSales = data.reduce((sum, row) => sum + (row.online_sales_amount || 0), 0);
  const offlineSales = data.reduce((sum, row) => sum + (row.offline_sales_amount || 0), 0);
  const onlinePercentage = totalRevenue > 0 
    ? ((onlineSales / totalRevenue) * 100).toFixed(1)
    : 0;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Daily Market-Wise Intelligence</h1>
        <p className="dashboard-subtitle">
          {new Date(filters.fromDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(filters.toDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          {loading && <span style={{ marginLeft: '10px', color: '#ff7300' }}>⏳ Loading...</span>}
        </p>
      </div>

      <Filters 
        filters={filters} 
        setFilters={setFilters} 
        stores={stores} 
        TranTypes={TransType} 
        ShopType={ShopType} 
      />

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Revenue</div>
          <div className="kpi-value">₹{(totalRevenue / 10000000).toFixed(1)} Cr</div>
          <div className={`kpi-change ${avgGrowth >= 0 ? 'positive' : 'negative'}`}>
            {avgGrowth >= 0 ? '↗' : '↘'} {Math.abs(avgGrowth)}%
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Bill Count</div>
          <div className="kpi-value">{(totalBills / 1000).toFixed(1)} K</div>
          <div className="kpi-change positive">
            ↗ {data.length} stores
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Online Mix</div>
          <div className="kpi-value">{onlinePercentage}%</div>
          <div className="kpi-change positive">
            ₹{(onlineSales / 10000000).toFixed(1)} Cr online
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Total Quantity</div>
          <div className="kpi-value">{(totalQty / 1000).toFixed(1)} K</div>
          <div className="kpi-change positive">
            Units sold
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="section-card">
          <div className="section-header">Revenue by Store</div>
          <SalesChart 
            data={data} 
            selectedStore={filters.store}
            onStoreClick={handleStoreClick}
          />
        </div>

        <div className="section-card">
          <div className="section-header">Online vs Offline Sales</div>
          <ReturnsChart data={data} />
        </div>
      </div>

      {/* Store Performance Table */}
      <div className="section-card">
        <div className="section-header">Market Performance</div>
        <StoreTable 
          data={data} 
          selectedStore={filters.store}
          onRowClick={handleTableRowClick}
        />
      </div>

      {/* Shop Type Performance Table */}
      <div className="section-card">
        <div className="section-header">Shop Type Performance</div>
        <ShopTypeTable 
          data={shopTypeData} 
          selectedShopType={filters.ShopType}
          onRowClick={handleShopTypeClick}
        />
      </div>

      {/* Online/Offline Breakdown */}
      <div className="section-card">
        <div className="section-header">Channel Mix by Store</div>
        <ProductTable data={data} />
      </div>

      {/* Month-on-Month Analysis */}
      <div className="section-card">
        <div className="section-header">Month-on-Month Performance</div>
        <MonthOnMonthTable data={monthOnMonthData} />
      </div>
    </div>
  );
}

export default App;