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
    supervisorMenu();
});

function supervisorMenu() {
    const options = ['View Product Sales by Department', 'Create New Department', 'Exit Program'];

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
                case 'View Product Sales by Department':
                    viewSales();
                    break;
                case 'Create New Department':
                    createDept();
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

function viewSales() {
    let query = "SELECT department_id, department_name, over_head_costs, product_sales, (product_sales - over_head_costs) AS total_profit ";
    query += "";
    
    connection.query(query, function(err, res) {
        if (err) throw err;

    });
}

// 4. When selects `View Product Sales by Department`, should display table in terminal window.

// | department_id | department_name | over_head_costs | product_sales | total_profit |
// | ------------- | --------------- | --------------- | ------------- | ------------ |
// | 01            | Electronics     | 10000           | 20000         | 10000        |
// | 02            | Clothing        | 60000           | 100000        | 40000        |

// 5. `total_profit` should be calculated on the fly using difference between `over_head_costs` and `product_sales`.
//     `total_profit` should not be stored in any database. You should use a custom alias.

//    * Hint: You may need to look into aliases in MySQL.
//    * Hint: You may need to look into GROUP BYs.
//    * Hint: You may need to look into JOINS.