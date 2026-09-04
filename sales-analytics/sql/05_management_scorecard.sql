-- Country x Year management scorecard
WITH base AS (
    SELECT Country, Year,
           SUM(Net_Sales) AS Revenue,
           SUM(Profit) AS Profit,
           SUM(Quantity) AS Units
    FROM analytics.vw_sales_enriched
    GROUP BY Country, Year
), ranked AS (
    SELECT *,
           CAST(Profit/NULLIF(Revenue,0) AS DECIMAL(12,4)) AS Profit_Margin,
           RANK() OVER (PARTITION BY Year ORDER BY Revenue DESC) AS Country_Rank,
           LAG(Revenue) OVER (PARTITION BY Country ORDER BY Year) AS Prior_Revenue,
           LAG(Profit) OVER (PARTITION BY Country ORDER BY Year) AS Prior_Profit,
           LAG(Units) OVER (PARTITION BY Country ORDER BY Year) AS Prior_Units
    FROM base
)
SELECT *,
       CAST((Revenue-Prior_Revenue)/NULLIF(Prior_Revenue,0) AS DECIMAL(12,4)) AS Revenue_YoY,
       CAST((Profit-Prior_Profit)/NULLIF(Prior_Profit,0) AS DECIMAL(12,4)) AS Profit_YoY,
       CAST((Units-Prior_Units)*1.0/NULLIF(Prior_Units,0) AS DECIMAL(12,4)) AS Units_YoY,
       CASE
         WHEN Profit_Margin < 0 THEN 'Loss'
         WHEN Profit_Margin < 0.10 THEN 'Watch'
         WHEN Profit_Margin < 0.20 THEN 'Healthy'
         ELSE 'Strong'
       END AS Performance_Status
FROM ranked
ORDER BY Year, Revenue DESC;
GO
