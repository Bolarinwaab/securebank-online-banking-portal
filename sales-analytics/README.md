# Enterprise Sales Analytics Dashboard

Portfolio-grade sales analytics extension. The implementation uses a comprehensive Superstore-style public benchmark dataset and provides an enterprise transaction model, SQL KPI layer, and executive dashboard specification. This is benchmark/demo data, not company production data.

## Management requirements
1. Revenue by Country
2. Revenue by Date and Year
3. Revenue, Profit and Units Sold YoY
4. Revenue by Discount Band
5. Country x Year management scorecard
6. Product, category, segment, market and shipping analysis

## Enterprise fields
Row_ID, Order_ID, Order_Date, Ship_Date, Ship_Mode, Customer_ID, Customer_Name, Segment, Country, Market, Region, State, City, Postal_Code, Product_ID, Category, Sub_Category, Product_Name, Sales, Quantity, Discount, Profit, Shipping_Cost, Order_Priority, Year, Quarter, Month, Month_Name, Discount_Band, Net_Sales, COGS, Profit_Margin, Revenue_YoY, Profit_YoY, Units_YoY, Revenue_MoM, Revenue_Rank, Country_Rank, Product_Rank, Performance_Status.

## Source
Public Superstore/Global Superstore benchmark datasets document order, customer, geography, product, sales, quantity, discount and profit fields. Source notes are in `documentation/data_provenance.md`.
