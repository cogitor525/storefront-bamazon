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
    displayItems();
});

// ***** this may need fixing to exclude items out-of-stock *****
let itemIDs;

function displayItems() {
// ***** change so only displays items in stock? *****
    const query = "SELECT item_id,product_name,price FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;

        res.forEach(function(item, index, array) {
            array[index].price = '$' + item.price.toFixed(2);
        });

        // .reduce() method is used to create an object from the response array of objects,
        //      such that the item_id values become the parent object keys,
        //      which are then assigned values as the remaining portion of the corresponding object.
        // this is done so that when console.table() renders the table,
        //      the first 'index' column has the item_id values, instead of the standard [0 ~ n] sequence.
        const idAsIndex = res.reduce(function(acc, {item_id, ...x}) {
            acc[item_id] = x;
            return acc;
        }, {});

        console.table(idAsIndex);
        itemIDs = Object.keys(idAsIndex);
        promptUser();
    });
}

function promptUser() {
    inquirer
// ***** change this part to include option to display items again *****
        .prompt([
            {
                name: "confirm",
                type: "confirm",
                message: "Would you like to place an order?"
            }
        ])
        .then(function(answer) {
            if (answer.confirm) {
                inquirer
                    .prompt([
                        {
                            name: "id",
                            type: "rawlist",
                            message: "Please select desired item by ID (index)",
                            choices: itemIDs
                        },
                        {
                            name: "qty",
                            message: "How many would you like to order?",
                            validate: function(value) {
                                if (!isNaN(value) && parseInt(value) > 0) {
                                    return true;
                                }
                                return false;
                            }
                        }
                    ])
                    .then(function(order) {
                        placeOrder(order);
                    });
            } else {
                console.log("exiting app...");
                connection.end();
            }
        });
}

function placeOrder(order) {
    const query = "SELECT stock_quantity,price FROM products WHERE ?";
    connection.query(query, { item_id: order.id }, function(err, res) {
        if (err) throw err;

        const newQty = res[0].stock_quantity - order.qty;
        const orderCost = order.qty * res[0].price;

        if (newQty >= 0) {
            const query = "UPDATE products SET stock_quantity = ?, product_sales = product_sales + ? WHERE item_id = ?";
            connection.query(query, [newQty, orderCost, order.id], function(err, res) {
                if (err) throw err;

                if (res.changedRows === 0) {
                    console.log("Sorry! There was an error while processing your order.");
                } else {
                    console.log("Order placed! The total cost is $" + orderCost.toFixed(2));
                }

                promptUser();
            });
        } else {
            console.log("Insufficient quantity!");
            promptUser();
        }        
    });
}