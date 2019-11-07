const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    managerMenu();
});

function managerMenu() {
    const options = ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit Program'];

    inquirer
        .prompt([
            {
                name: "menu",
                type: "rawlist",
                message: "Please make your selection:",
                choices: options
            }
        ])
        .then(function(choice) {
            switch(choice.menu) {
                case 'View Products for Sale':
                    viewProducts("SELECT item_id,product_name,price,stock_quantity FROM products");
                    break;
                case 'View Low Inventory':
                    viewProducts("SELECT item_id,product_name,price,stock_quantity FROM products WHERE stock_quantity < 5");
                    break;
                case 'Add to Inventory':
                    addInventory();
                    break;
                case 'Add New Product':
                    newProduct();
                    break;
                case 'Exit Program':
                    console.log('Exiting program...');
                    connection.end();
                    break;
                default:
                    console.log('Error: unrecognized input');
                    connection.end();
            }
        });
}

function viewProducts(query) {
    connection.query(query, function(err, res) {
        if (err) throw err;

        if (res.length == 0) {
            console.log("No items low on inventory!");
        } else {
            const idAsIndex = res.reduce(function(acc, {item_id, ...x}) {
                acc[item_id] = x;
                return acc;
            }, {});
            console.table(idAsIndex);
        }        
        managerMenu();
    });
}

function addInventory() {
    connection.query("SELECT item_id FROM products", function(err, res) {
        if (err) throw err;

        const itemIDs = res.reduce(function(acc, currentVal, currentIndex) {
            acc[currentIndex] = currentVal.item_id;
            return acc;
        }, []);

        inquirer
            .prompt([
                {
                    name: "id",
                    type: "rawlist",
                    message: "Please select item by ID:",
                    choices: itemIDs
                },
                {
                    name: "addQty",
                    message: "Add how many units? (0 to cancel)",
                    validate: function(value) {
                        if (!isNaN(value) && parseInt(value) >= 0) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function(item) {
                if (item.addQty == 0) {
                    console.log("cancelling 'Add to Inventory'...");
                    managerMenu();
                } else {
                    const query = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?";
                    connection.query(query, [item.addQty, item.id], function(err, res) {
                        if (err) throw err;

                        if (res.changedRows === 0) {
                            console.log("Sorry! There was an error while processing your request.");
                        } else {
                            console.log("Successfully added " + item.addQty + " units to stock for item '" + item.id + "'");
                        }
                        managerMenu();
                    });
                }
            });
    });
}

function newProduct() {
    connection.query("SELECT department_id, department_name FROM departments", function(err, res) {
        if (err) throw err;

        const depts = res.reduce(function(acc, currentVal, currentIndex) {
            acc[currentIndex] = currentVal.department_name;
            return acc;
        }, []);

        inquirer
            .prompt([
                {
                    name: "dept",
                    type: "rawlist",
                    message: "Select department for new product:",
                    choices: depts
                },
                {
                    name: "name",
                    message: "Please enter product title:"
                },
                {
                    name: "price",
                    message: "Enter per unit price for item:",
                    validate: function(value) {
                        if (!isNaN(value) && value > 0) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "qty",
                    message: "Please enter starting inventory amount:",
                    validate: function(value) {
                        if (!isNaN(value) && parseInt(value) > 0) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function(item) {
                const deptID = res.find(function(ele) {
                    return ele.department_name === item.dept;
                }).department_id;

                connection.query("SELECT MAX(item_id) AS prevID FROM products WHERE ?", { department_id: deptID }, function(err, res) {
                    if (err) throw err;

                    // this code block generates the value for the new 'item_id' based off the existing items in the department,
                    // OR defaults to a starting value if the item is first for the department
                    let itemID;
                    if (res[0].prevID === null) {
                        itemID = deptID + "-01";
                    } else {
                        itemID = res[0].prevID.slice(0,3);
                        const itemIDnum = function() {
                            let num = parseInt(res[0].prevID.slice(3));
                            num++;
                            if (num < 10) {
                                num = '0' + num;
                            }
                            return num;
                        }
                        itemID += itemIDnum();
                    }

                    const query = "INSERT INTO products (item_id, product_name, department_id, price, stock_quantity) VALUES (?, ?, ?, ?, ?)";
                    connection.query(query, [itemID, item.name, deptID, item.price, item.qty], function(err, res) {
                        if (err) throw err;

                        if (res.affectedRows === 0) {
                            console.log("Sorry! There was an error while adding the item to the database.");
                        } else {
                            console.log("Successfully added new product '" + itemID + "'");
                        }
                        managerMenu();
                    });
                });
            });
    });
}