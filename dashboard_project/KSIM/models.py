from django.db import models


class StoreData(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    is_active = models.BooleanField()
    store_name = models.CharField(max_length=255, null=True)
    store_full_name = models.CharField(max_length=255, null=True)

    class Meta:
        db_table = "tbl_store_data"


class SalesData(models.Model):
    id = models.BigAutoField(primary_key=True)
    bill_date = models.DateField(null=True)
    design_number = models.CharField(max_length=255, null=True)

    # Foreign Key to store table (VARCHAR → CharField FK)
    outlets = models.ForeignKey(
        StoreData,
        db_column="outlets_id",
        to_field="id",
        on_delete=models.DO_NOTHING,
        null=True
    )

    # You might also reference combination table in the future
    combination_id = models.CharField(max_length=255, null=True)

    item_amt_before_vat = models.FloatField(null=True)
    po_number = models.CharField(max_length=255, null=True)
    salesman_name = models.CharField(max_length=255, null=True)
    sold_qty = models.IntegerField(null=True)
    tran_type = models.CharField(max_length=255, null=True)
    unit_item_cost = models.FloatField(null=True)
    vat_amount = models.FloatField(null=True)

    bill_number = models.CharField(max_length=255, null=True)
    ref_bill_no = models.CharField(max_length=255, null=True)
    bill_time = models.DateTimeField(null=True)

    class Meta:
        db_table = "tbl_sales"
        indexes = [
            models.Index(fields=["bill_date"]),
            models.Index(fields=["bill_number"]),
            models.Index(fields=["combination_id"]),
            models.Index(fields=["outlets"]),
        ]
