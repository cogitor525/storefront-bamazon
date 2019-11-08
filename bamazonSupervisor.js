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

function createDept() {
    inquirer
        .prompt([
            {
                name: "name",
                message: "Please enter name of new department:",
                validate: function(value) {
                    if (value.length > 25) {
                        return "Department name cannot exceed 25 characters in length!";
                    } else if (value.length < 5) {
                        return "Department name should be at least 5 characters in length";
                    } else {
                        return true;
                    }
                }
            },
            {
                name: "id",
                message: "Enter a [two character] ID code for this new department:",
                validate: function(value) {
                    if (value.length != 2) {
                        return "Department ID must be 2 characters in length";
                    } else {
                        return true;
                    }
                }
            },
            {
                name: "overhead",
                message: "Please enter overhead costs for department:",
                validate: function(value) {
                    if (!isNaN(value) && parseInt(value) > 0) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(dept) {
            const query = "INSERT INTO departments (department_id, department_name, over_head_costs) VALUES (?, ?, ?)";
            connection.query(query, [dept.id, dept.name, dept.overhead], function(err, res) {
                if (err) throw err;

                if (res.affectedRows === 0) {
                    console.log("Sorry! There was an error while adding the dept to the database.");
                } else {
                    console.log("Successfully added new department '" + dept.name + "'");
                }
                supervisorMenu();
            });
        });
}