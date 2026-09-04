-- Executive KPI queries
SELECT
    SUM(Net_Sales) AS Total_Revenue,
    SUM(Profit) AS Gross_Profit,
    CAST(SUM(Profit) / NULLIF(SUM(Net_Sales),0) AS DECIMAL(12,4)) AS Profit_Margin,
    SUM(Quantity) AS Units_Sold,
    COUNT(DISTINCT Order_ID) AS Orders,
    COUNT(DISTINCT Customer_ID) AS Customers,
    AVG(NULLIF(Net_Sales,0)) AS Avg_Order_Line_Value
FROM analytics.vw_sales_enriched;
GO

-- Revenue by country
SELECT Country, SUM(Net_Sales) AS Revenue, SUM(Profit) AS Profit,
       CAST(SUM(Profit)/NULLIF(SUM(Net_Sales),0) AS DECIMAL(12,4)) AS Profit_Margin
FROM analytics.vw_sales_enriched
GROUP BY Country
ORDER BY Revenue DESC;
GO

-- Revenue by discount band
SELECT Discount_Band, SUM(Net_Sales) AS Revenue, SUM(Profit) AS Profit,
       SUM(Quantity) AS Units_Sold,
       CAST(SUM(Profit)/NULLIF(SUM(Net_Sales),0) AS DECIMAL(12,4)) AS Profit_Margin
FROM analytics.vw_sales_enriched
GROUP BY Discount_Band
ORDER BY Revenue DESC;
GO
