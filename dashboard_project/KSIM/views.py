from django.http import JsonResponse
from django.db import connection
from django.core.cache import cache
import hashlib
import json
import time
import datetime

def store_summary(request):
    from_date = request.GET.get("from_date")
    to_date = request.GET.get("to_date")
    store = request.GET.get("store")
    shop_type = request.GET.get("shop_type")
    tran_type = request.GET.get("tran_type")

    if not from_date or not to_date:
        return JsonResponse({"error": "from_date and to_date are required"}, status=400)

    # Create cache key
    cache_key = hashlib.md5(
        json.dumps({
            'type': 'store_summary',
            'from_date': from_date,
            'to_date': to_date,
            'store': store,
            'shop_type': shop_type,
            'tran_type': tran_type
        }, sort_keys=True).encode()
    ).hexdigest()
    
    cache_key = f"store_summary_{cache_key}"
    
    # Check cache
    cached_data = cache.get(cache_key)
    if cached_data:
        print("✅ Returning cached store data")
        return JsonResponse(cached_data, safe=False)

    start_time = time.time()

    # Calculate last year dates
    from_date_obj = datetime.datetime.strptime(from_date, '%Y-%m-%d')
    to_date_obj = datetime.datetime.strptime(to_date, '%Y-%m-%d')
    last_year_from = (from_date_obj - datetime.timedelta(days=365)).strftime('%Y-%m-%d')
    last_year_to = (to_date_obj - datetime.timedelta(days=365)).strftime('%Y-%m-%d')

    # Build WHERE clause
    where_filters = ["(bill_date BETWEEN %s AND %s OR bill_date BETWEEN %s AND %s)"]
    filter_params = [from_date, to_date, last_year_from, last_year_to]

    if store:
        where_filters.append("store_full_name = %s")
        filter_params.append(store)

    if shop_type:
        where_filters.append("shop_type = %s")
        filter_params.append(shop_type)

    if tran_type:
        where_filters.append("tran_type = %s")
        filter_params.append(tran_type)

    where_clause = " AND ".join(where_filters)

    # SIMPLIFIED SQL - Just get raw data, no complex calculations
    sql = f"""
        SELECT 
            store_full_name,
            bill_date,
            SUM(item_net_amount) as sales,
            SUM(sold_qty) as qty,
            COUNT(DISTINCT bill_number) as bills,
            SUM(CASE WHEN shop_type <> 'Offline' AND shop_type IS NOT NULL THEN item_net_amount ELSE 0 END) as online_sales,
            SUM(CASE WHEN shop_type = 'Offline' THEN item_net_amount ELSE 0 END) as offline_sales
        FROM tbl_sales_daily_summary
        WHERE {where_clause}
        GROUP BY store_full_name, bill_date;
    """

    with connection.cursor() as cursor:
        query_start = time.time()
        cursor.execute(sql, filter_params)
        query_time = time.time() - query_start
        
        rows = cursor.fetchall()

    # Process data in Python (MUCH FASTER than SQL for calculations)
    stores = {}
    
    for row in rows:
        store_name, bill_date, sales, qty, bills, online, offline = row
        
        if store_name not in stores:
            stores[store_name] = {
                'store': store_name,
                'current_sales': 0,
                'last_year_sales': 0,
                'total_qty': 0,
                'total_bills': 0,
                'online_sales_amount': 0,
                'offline_sales_amount': 0
            }
        
        # Convert Decimal to float to avoid type errors
        sales = float(sales) if sales else 0
        qty = float(qty) if qty else 0
        bills = int(bills) if bills else 0
        online = float(online) if online else 0
        offline = float(offline) if offline else 0
        
        # Categorize by date period
        if from_date <= bill_date.strftime('%Y-%m-%d') <= to_date:
            # Current period
            stores[store_name]['current_sales'] += sales
            stores[store_name]['total_qty'] += qty
            stores[store_name]['total_bills'] += bills
            stores[store_name]['online_sales_amount'] += online
            stores[store_name]['offline_sales_amount'] += offline
        else:
            # Last year period
            stores[store_name]['last_year_sales'] += sales
    
    # Calculate derived metrics in Python
    data = []
    for store_name, metrics in stores.items():
        # Safe calculations - no Infinity!
        current_sales = metrics['current_sales']
        last_year_sales = metrics['last_year_sales']
        total_qty = metrics['total_qty']
        total_bills = metrics['total_bills']
        
        # Growth percentage
        if last_year_sales > 0:
            growth_percent = round(((current_sales - last_year_sales) / last_year_sales) * 100, 2)
        else:
            growth_percent = 0
        
        # Average selling price
        if total_qty > 0:
            avg_selling_price = round(current_sales / total_qty, 2)
        else:
            avg_selling_price = 0
        
        # Units per transaction
        if total_bills > 0:
            units_per_transaction = round(total_qty / total_bills, 2)
        else:
            units_per_transaction = 0
        
        # Skip stores with no current sales
        if current_sales == 0:
            continue
        
        data.append({
            'store': store_name,
            'current_sales': current_sales,
            'last_year_sales': last_year_sales,
            'growth_percent': growth_percent,
            'total_qty': total_qty,
            'total_bills': total_bills,
            'avg_selling_price': avg_selling_price,
            'units_per_transaction': units_per_transaction,
            'online_sales_amount': metrics['online_sales_amount'],
            'offline_sales_amount': metrics['offline_sales_amount']
        })
    
    # Sort by current sales
    data.sort(key=lambda x: x['current_sales'], reverse=True)
    
    total_time = time.time() - start_time
    print(f"⏱️  Store Query time: {query_time:.2f}s, Total time: {total_time:.2f}s")
    print(f"📊 Rows returned: {len(data)}")

    # Cache for 30 minutes
    cache.set(cache_key, data, 1800)
    
    return JsonResponse(data, safe=False)


def shop_type_summary(request):
    from_date = request.GET.get("from_date")
    to_date = request.GET.get("to_date")
    store = request.GET.get("store")
    shop_type = request.GET.get("shop_type")
    tran_type = request.GET.get("tran_type")

    if not from_date or not to_date:
        return JsonResponse({"error": "from_date and to_date are required"}, status=400)

    # Create cache key
    cache_key = hashlib.md5(
        json.dumps({
            'type': 'shop_type_summary',
            'from_date': from_date,
            'to_date': to_date,
            'store': store,
            'shop_type': shop_type,
            'tran_type': tran_type
        }, sort_keys=True).encode()
    ).hexdigest()
    
    cache_key = f"shop_type_summary_{cache_key}"
    
    # Check cache
    cached_data = cache.get(cache_key)
    if cached_data:
        print("✅ Returning cached shop type data")
        return JsonResponse(cached_data, safe=False)

    start_time = time.time()

    # Calculate last year dates
    from_date_obj = datetime.datetime.strptime(from_date, '%Y-%m-%d')
    to_date_obj = datetime.datetime.strptime(to_date, '%Y-%m-%d')
    last_year_from = (from_date_obj - datetime.timedelta(days=365)).strftime('%Y-%m-%d')
    last_year_to = (to_date_obj - datetime.timedelta(days=365)).strftime('%Y-%m-%d')

    # Build WHERE clause
    where_filters = ["(bill_date BETWEEN %s AND %s OR bill_date BETWEEN %s AND %s)"]
    filter_params = [from_date, to_date, last_year_from, last_year_to]

    if store:
        where_filters.append("store_full_name = %s")
        filter_params.append(store)

    if shop_type:
        where_filters.append("shop_type = %s")
        filter_params.append(shop_type)

    if tran_type:
        where_filters.append("tran_type = %s")
        filter_params.append(tran_type)

    where_clause = " AND ".join(where_filters)

    # SIMPLIFIED SQL
    sql = f"""
        SELECT 
            COALESCE(shop_type, 'Unknown') as shop_type,
            bill_date,
            store_full_name,
            SUM(item_net_amount) as sales,
            SUM(sold_qty) as qty,
            COUNT(DISTINCT bill_number) as bills
        FROM tbl_sales_daily_summary
        WHERE {where_clause}
        GROUP BY shop_type, bill_date, store_full_name;
    """

    with connection.cursor() as cursor:
        query_start = time.time()
        cursor.execute(sql, filter_params)
        query_time = time.time() - query_start
        
        rows = cursor.fetchall()

    # Process data in Python
    shop_types = {}
    
    for row in rows:
        shop_type_name, bill_date, store_name, sales, qty, bills = row
        
        if shop_type_name == 'Unknown' or not shop_type_name:
            continue
        
        if shop_type_name not in shop_types:
            shop_types[shop_type_name] = {
                'shop_type': shop_type_name,
                'current_sales': 0,
                'last_year_sales': 0,
                'total_qty': 0,
                'total_bills': 0,
                'stores': set()
            }
        
        # Convert Decimal to float to avoid type errors
        sales = float(sales) if sales else 0
        qty = float(qty) if qty else 0
        bills = int(bills) if bills else 0
        
        # Categorize by date period
        if from_date <= bill_date.strftime('%Y-%m-%d') <= to_date:
            shop_types[shop_type_name]['current_sales'] += sales
            shop_types[shop_type_name]['total_qty'] += qty
            shop_types[shop_type_name]['total_bills'] += bills
            shop_types[shop_type_name]['stores'].add(store_name)
        else:
            shop_types[shop_type_name]['last_year_sales'] += sales
    
    # Calculate derived metrics
    data = []
    for shop_type_name, metrics in shop_types.items():
        current_sales = metrics['current_sales']
        last_year_sales = metrics['last_year_sales']
        total_qty = metrics['total_qty']
        total_bills = metrics['total_bills']
        
        # Growth percentage
        if last_year_sales > 0:
            growth_percent = round(((current_sales - last_year_sales) / last_year_sales) * 100, 2)
        else:
            growth_percent = 0
        
        # Average selling price
        if total_qty > 0:
            avg_selling_price = round(current_sales / total_qty, 2)
        else:
            avg_selling_price = 0
        
        # Units per transaction
        if total_bills > 0:
            units_per_transaction = round(total_qty / total_bills, 2)
        else:
            units_per_transaction = 0
        
        # Skip if no current sales
        if current_sales == 0:
            continue
        
        data.append({
            'shop_type': shop_type_name,
            'current_sales': current_sales,
            'last_year_sales': last_year_sales,
            'growth_percent': growth_percent,
            'total_qty': total_qty,
            'total_bills': total_bills,
            'avg_selling_price': avg_selling_price,
            'units_per_transaction': units_per_transaction,
            'store_count': len(metrics['stores'])
        })
    
    # Sort by current sales
    data.sort(key=lambda x: x['current_sales'], reverse=True)
    
    total_time = time.time() - start_time
    print(f"⏱️  Shop Type Query time: {query_time:.2f}s, Total time: {total_time:.2f}s")
    print(f"📊 Rows returned: {len(data)}")

    # Cache for 30 minutes
    cache.set(cache_key, data, 1800)
    
    return JsonResponse(data, safe=False)

def store_list(request):
    cache_key = "store_list"
    cached_data = cache.get(cache_key)
    
    if cached_data:
        return JsonResponse(cached_data, safe=False)
    
    sql = """
        SELECT DISTINCT store_full_name AS store
        FROM tbl_sales_daily_summary
        WHERE store_full_name IS NOT NULL
        ORDER BY store_full_name;
    """

    with connection.cursor() as cursor:
        cursor.execute(sql)
        rows = cursor.fetchall()

    data = [{"store": row[0]} for row in rows]
    cache.set(cache_key, data, 600)
    
    return JsonResponse(data, safe=False)


def tran_type_list(request):
    cache_key = "tran_type_list"
    cached_data = cache.get(cache_key)
    
    if cached_data:
        return JsonResponse(cached_data, safe=False)
    
    sql = """
        SELECT DISTINCT tran_type
        FROM tbl_sales_daily_summary
        WHERE tran_type IS NOT NULL
        ORDER BY tran_type;
    """

    with connection.cursor() as cursor:
        cursor.execute(sql)
        rows = cursor.fetchall()

    data = [{"tran_type": row[0]} for row in rows]
    cache.set(cache_key, data, 600)
    
    return JsonResponse(data, safe=False)


def shop_type_list(request):
    cache_key = "shop_type_list"
    cached_data = cache.get(cache_key)
    
    if cached_data:
        return JsonResponse(cached_data, safe=False)
    
    sql = """
        SELECT DISTINCT shop_type
        FROM tbl_sales_daily_summary
        WHERE shop_type IS NOT NULL
        ORDER BY shop_type;
    """

    with connection.cursor() as cursor:
        cursor.execute(sql)
        rows = cursor.fetchall()

    data = [{"shop_type": row[0]} for row in rows]
    cache.set(cache_key, data, 600)
    
    return JsonResponse(data, safe=False)

# Add this to your views.py

# Add this to your views.py

def store_month_on_month(request):
    from_date = request.GET.get("from_date")
    to_date = request.GET.get("to_date")
    store = request.GET.get("store")
    shop_type = request.GET.get("shop_type")
    tran_type = request.GET.get("tran_type")

    if not from_date or not to_date:
        return JsonResponse({"error": "from_date and to_date are required"}, status=400)

    # Create cache key
    cache_key = hashlib.md5(
        json.dumps({
            'type': 'month_on_month',
            'from_date': from_date,
            'to_date': to_date,
            'store': store,
            'shop_type': shop_type,
            'tran_type': tran_type
        }, sort_keys=True).encode()
    ).hexdigest()
    
    cache_key = f"month_on_month_{cache_key}"
    
    # Check cache
    cached_data = cache.get(cache_key)
    if cached_data:
        print("✅ Returning cached month-on-month data")
        return JsonResponse(cached_data, safe=False)

    start_time = time.time()

    # Build WHERE clause
    where_filters = ["bill_date BETWEEN %s AND %s"]
    filter_params = [from_date, to_date]

    if store:
        where_filters.append("store_full_name = %s")
        filter_params.append(store)

    if shop_type:
        where_filters.append("shop_type = %s")
        filter_params.append(shop_type)

    if tran_type:
        where_filters.append("tran_type = %s")
        filter_params.append(tran_type)

    where_clause = " AND ".join(where_filters)

    sql = f"""
        SELECT 
            store_full_name as store,
            DATE_FORMAT(bill_date, '%%Y-%%m') as month,
            SUM(item_net_amount) as total_sales,
            SUM(sold_qty) as total_qty
        FROM tbl_sales_daily_summary
        WHERE {where_clause}
        GROUP BY store_full_name, DATE_FORMAT(bill_date, '%%Y-%%m')
        ORDER BY store_full_name, month;
    """

    with connection.cursor() as cursor:
        query_start = time.time()
        cursor.execute(sql, filter_params)
        query_time = time.time() - query_start
        
        rows = cursor.fetchall()

    total_time = time.time() - start_time
    print(f"⏱️  Month-on-Month Query time: {query_time:.2f}s, Total time: {total_time:.2f}s")
    print(f"📊 Rows returned: {len(rows)}")

    # Transform data to store-month matrix format
    stores = {}
    months_set = set()
    
    for row in rows:
        store, month, sales, qty = row
        if store not in stores:
            stores[store] = {}
        stores[store][month] = {
            'sales': sales,
            'qty': qty
        }
        months_set.add(month)
    
    # Sort months chronologically
    months = sorted(list(months_set))
    
    # Build final data structure
    data = {
        'months': months,
        'stores': [
            {
                'store': store,
                'data': [stores[store].get(month, {'sales': 0, 'qty': 0}) for month in months]
            }
            for store in sorted(stores.keys())
        ]
    }
    
    # Cache for 30 minutes
    cache.set(cache_key, data, 1800)
    
    return JsonResponse(data, safe=False)