import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export const getStoreSummary = (filters) => {
  return API.get("/store-summary/", {
    params: {
      store: filters.store,
      shop_type: filters.ShopType,
      tran_type: filters.TranType,
      from_date: filters.fromDate,
      to_date: filters.toDate,
    },
  });
};

export const getShopTypeSummary = (filters) => {
  return API.get("/shop-type-summary/", {
    params: {
      store: filters.store,
      shop_type: filters.ShopType,
      tran_type: filters.TranType,
      from_date: filters.fromDate,
      to_date: filters.toDate,
    },
  });
};

export const getMonthOnMonth = (filters) => {
  return API.get("/month-on-month/", {
    params: {
      store: filters.store,
      shop_type: filters.ShopType,
      tran_type: filters.TranType,
      from_date: filters.fromDate,
      to_date: filters.toDate,
    },
  });
};

export const getStoreList = () => {
  return API.get("/store-list/");
};

export const getTranTypeList = () => {
  return API.get("/tran_type-list/");
};

export const getShopTypeList = () => {
  return API.get("/shop_type-list/");
};