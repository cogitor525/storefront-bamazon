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

function displayItems() {
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
    });
}


// 6. The app should then prompt users with two messages.

//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.
