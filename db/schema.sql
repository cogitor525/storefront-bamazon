DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE departments (
    department_id VARCHAR(5) PRIMARY KEY,
    department_name VARCHAR(25),
    over_head_costs INT
);

CREATE TABLE products (
    item_id VARCHAR(10) PRIMARY KEY,
    product_name VARCHAR(50),
    department_id VARCHAR(5),
    price FLOAT,
    stock_quantity INT,
    product_sales FLOAT DEFAULT 0,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);