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
    const options = ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'];

    inquirer
        .prompt([
            {
                name: "menu",
                type: "list",
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
                    console.log('Add to Inventory')
                    break;
                case 'Add New Product':
                    console.log('Add New Product')
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

//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
