-- Monthly revenue/profit/units and YoY metrics
WITH monthly AS (
    SELECT
        DATEFROMPARTS(Year, Month, 1) AS Month_Start,
        Year, Month, Month_Name,
        SUM(Net_Sales) AS Revenue,
        SUM(Profit) AS Profit,
        SUM(Quantity) AS Units
    FROM analytics.vw_sales_enriched
    GROUP BY Year, Month, Month_Name
), calc AS (
    SELECT *,
        LAG(Revenue) OVER (ORDER BY Month_Start) AS Prior_Revenue,
        LAG(Profit) OVER (ORDER BY Month_Start) AS Prior_Profit,
        LAG(Units) OVER (ORDER BY Month_Start) AS Prior_Units
    FROM monthly
)
SELECT *,
    CAST((Revenue-Prior_Revenue)/NULLIF(Prior_Revenue,0) AS DECIMAL(12,4)) AS Revenue_YoY,
    CAST((Profit-Prior_Profit)/NULLIF(Prior_Profit,0) AS DECIMAL(12,4)) AS Profit_YoY,
    CAST((Units-Prior_Units)*1.0/NULLIF(Prior_Units,0) AS DECIMAL(12,4)) AS Units_YoY
FROM calc
ORDER BY Month_Start;
GO
