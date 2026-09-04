# Enterprise Sales Analytics Data Dictionary

| Field | Type | Classification | Purpose |
|---|---|---|---|
| Row_ID | BIGINT | Source | Unique transaction line identifier |
| Order_ID | NVARCHAR | Source | Business order identifier |
| Order_Date | DATE | Source | Order transaction date |
| Ship_Date | DATE | Source | Shipment date |
| Ship_Mode | NVARCHAR | Source | Delivery method |
| Customer_ID | NVARCHAR | Source | Customer identifier |
| Customer_Name | NVARCHAR | Source | Customer name |
| Segment | NVARCHAR | Source | Consumer / Corporate / Home Office |
| Country | NVARCHAR | Source | Customer country |
| Market | NVARCHAR | Source/Extended | Global market grouping |
| Region | NVARCHAR | Source | Geographic region |
| State | NVARCHAR | Source | State/province |
| City | NVARCHAR | Source | City |
| Postal_Code | NVARCHAR | Source | Postal code |
| Product_ID | NVARCHAR | Source | Product identifier |
| Category | NVARCHAR | Source | Product category |
| Sub_Category | NVARCHAR | Source | Product sub-category |
| Product_Name | NVARCHAR | Source | Product description |
| Sales | DECIMAL | Source | Transaction sales value |
| Quantity | INT | Source | Units sold |
| Discount | DECIMAL | Source | Discount rate |
| Profit | DECIMAL | Source | Transaction profit/loss |
| Shipping_Cost | DECIMAL | Extended | Delivery cost where available |
| Order_Priority | NVARCHAR | Extended | Operational priority |
| Year | INT | Derived | Calendar year |
| Quarter | INT | Derived | Calendar quarter |
| Month | INT | Derived | Month number |
| Month_Name | NVARCHAR | Derived | Month label |
| Discount_Band | NVARCHAR | Derived | None / Low / Medium / High |
| Net_Sales | DECIMAL | Derived | Sales used as analytical revenue |
| COGS | DECIMAL | Derived | Sales less profit, where applicable |
| Profit_Margin | DECIMAL | Derived | Profit divided by sales |
| Delivery_Days | INT | Derived | Ship date minus order date |
| Revenue_YoY | DECIMAL | Derived | Year-over-year revenue change |
| Profit_YoY | DECIMAL | Derived | Year-over-year profit change |
| Units_YoY | DECIMAL | Derived | Year-over-year units change |
| Revenue_MoM | DECIMAL | Derived | Month-over-month revenue change |
| Revenue_Rank | INT | Derived | Revenue ranking |
| Country_Rank | INT | Derived | Country revenue ranking |
| Product_Rank | INT | Derived | Product revenue ranking |
| Performance_Status | NVARCHAR | Derived | Loss / Watch / Healthy / Strong |
