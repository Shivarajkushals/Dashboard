from django.urls import path
from .views import store_summary, store_list, tran_type_list, shop_type_list, shop_type_summary, store_month_on_month

urlpatterns = [
    path("store-summary/", store_summary, name="store_summary"),
    path("shop-type-summary/", shop_type_summary, name="shop_type_summary"),
    path("month-on-month/", store_month_on_month, name="month_on_month"),  # NEW
    path("store-list/", store_list, name="store_list"),
    path("tran_type-list/", tran_type_list, name="tran_type_list"),
    path("shop_type-list/", shop_type_list, name="shop_type_list"),
]