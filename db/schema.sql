DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id VARCHAR(10) PRIMARY KEY,
    product_name VARCHAR(50),
    department_name VARCHAR(25),
    price FLOAT,
    stock_quantity INT
);
