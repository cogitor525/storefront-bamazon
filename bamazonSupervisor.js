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
                    // createDept();
                    console.log("createDept() here");
                    supervisorMenu();
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
    let query = "SELECT d.department_id, department_name, over_head_costs, ";
    query += "SUM(product_sales) AS dept_sales, (SUM(product_sales) - over_head_costs) AS total_profit ";
    query += "FROM departments AS d LEFT JOIN products AS p ON d.department_id = p.department_id GROUP BY department_id";

    connection.query(query, function(err, res) {
        if (err) throw err;

        const idAsIndex = res.reduce(function(acc, {department_id, ...x}) {
            acc[department_id] = x;
            return acc;
        }, {});
        console.table(idAsIndex);

        supervisorMenu();
    });
}

// | department_id | department_name | over_head_costs | product_sales | total_profit |
// | ------------- | --------------- | --------------- | ------------- | ------------ |
// | 01            | Electronics     | 10000           | 20000         | 10000        |
// | 02            | Clothing        | 60000           | 100000        | 40000        |