-- SQL Server enterprise sales analytics schema
CREATE SCHEMA analytics;
GO

CREATE TABLE analytics.fact_sales (
    Row_ID BIGINT NOT NULL,
    Order_ID NVARCHAR(40) NOT NULL,
    Order_Date DATE NOT NULL,
    Ship_Date DATE NULL,
    Ship_Mode NVARCHAR(30) NULL,
    Customer_ID NVARCHAR(30) NULL,
    Customer_Name NVARCHAR(150) NULL,
    Segment NVARCHAR(40) NULL,
    Country NVARCHAR(100) NULL,
    Market NVARCHAR(50) NULL,
    Region NVARCHAR(80) NULL,
    State NVARCHAR(100) NULL,
    City NVARCHAR(100) NULL,
    Postal_Code NVARCHAR(20) NULL,
    Product_ID NVARCHAR(40) NULL,
    Category NVARCHAR(80) NULL,
    Sub_Category NVARCHAR(80) NULL,
    Product_Name NVARCHAR(255) NULL,
    Sales DECIMAL(19,4) NOT NULL,
    Quantity INT NOT NULL,
    Discount DECIMAL(9,4) NOT NULL,
    Profit DECIMAL(19,4) NOT NULL,
    Shipping_Cost DECIMAL(19,4) NULL,
    Order_Priority NVARCHAR(30) NULL,
    CONSTRAINT PK_fact_sales PRIMARY KEY (Row_ID)
);
GO

CREATE INDEX IX_fact_sales_order_date ON analytics.fact_sales(Order_Date);
CREATE INDEX IX_fact_sales_country ON analytics.fact_sales(Country);
CREATE INDEX IX_fact_sales_product ON analytics.fact_sales(Product_ID);
