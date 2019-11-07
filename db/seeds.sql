INSERT INTO departments (department_id, department_name, over_head_costs)
VALUES ("FS", "foodstuffs", 1000);

INSERT INTO departments (department_id, department_name, over_head_costs)
VALUES ("PS", "pet supplies", 2000);

INSERT INTO departments (department_id, department_name, over_head_costs)
VALUES ("OS", "office supplies", 3000);


INSERT INTO products (item_id, product_name, department_id, price, stock_quantity)
VALUES ("FS-01", "coffee beans (medium roast)", "FS", 12, 50);

INSERT INTO products (item_id, product_name, department_id, price, stock_quantity)
VALUES ("FS-02", "ramen noodles (case of 10)", "FS", 10, 70);

INSERT INTO products (item_id, product_name, department_id, price, stock_quantity)
VALUES ("FS-03", "beef jerky", "FS", 8.50, 50);

INSERT INTO products (item_id, product_name, department_id, price, stock_quantity)
VALUES ("PS-01", "cat food (dry)", "PS", 25, 40);

INSERT INTO products (item_id, product_name, department_id, price, stock_quantity)
VALUES ("PS-02", "cat litter", "PS", 15, 40);

INSERT INTO products (item_id, product_name, department_id, price, stock_quantity)
VALUES ("PS-03", "dog food (dry)", "PS", 25, 35);

INSERT INTO products (item_id, product_name, department_id, price, stock_quantity)
VALUES ("OS-01", "ballpoint pens (box of 12)", "OS", 7.50, 100);

INSERT INTO products (item_id, product_name, department_id, price, stock_quantity)
VALUES ("OS-02", "notebooks (pack of 3)", "OS", 8.50, 100);

INSERT INTO products (item_id, product_name, department_id, price, stock_quantity)
VALUES ("OS-03", "printer ink cartridge", "OS", 30, 50);

INSERT INTO products (item_id, product_name, department_id, price, stock_quantity)
VALUES ("OS-04", "printer paper (ream of 500 sheets)", "OS", 7.50, 100);