-- Derived enterprise fields
CREATE OR ALTER VIEW analytics.vw_sales_enriched AS
SELECT
    f.*,
    YEAR(f.Order_Date) AS Year,
    DATEPART(QUARTER, f.Order_Date) AS Quarter,
    MONTH(f.Order_Date) AS Month,
    DATENAME(MONTH, f.Order_Date) AS Month_Name,
    DATEPART(ISO_WEEK, f.Order_Date) AS Week_Number,
    CASE
        WHEN f.Discount = 0 THEN 'None'
        WHEN f.Discount < 0.15 THEN 'Low'
        WHEN f.Discount < 0.30 THEN 'Medium'
        ELSE 'High'
    END AS Discount_Band,
    f.Sales AS Net_Sales,
    f.Sales - f.Profit AS COGS,
    CAST(f.Profit / NULLIF(f.Sales, 0) AS DECIMAL(12,6)) AS Profit_Margin,
    DATEDIFF(DAY, f.Order_Date, f.Ship_Date) AS Delivery_Days
FROM analytics.fact_sales f;
GO
