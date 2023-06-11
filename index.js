const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678@',
    database: 'employees_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected');
    start();
});

async function start() {
    const inquirer = await import('inquirer');
    inquirer
        .default.prompt([
            {
                type: "list",
                name: "databaseTask",
                message: "What would you like to do?",
                choices: [
                    "View All Employees",
                    "Add Employee",
                    "Update Employee Role",
                    "View All Roles",
                    "Add Role",
                    "View All Departments",
                    "Add Department",
                    "Quit",
                ]
            }
        ])
        .then((answers) => {
            const { databaseTask } = answers;
            switch (databaseTask) {
                case "View All Employees":
                    // viewAllEmployees();
                    break;
                case "Add Employee":
                    // addEmployee();
                    break;
                case "Update Employee Role":
                    // updateEmployeeRole();
                    break;
                case "View All Roles":
                    // viewAllRoles();
                    break;
                case "Add Role":
                    // addRole();
                    break;
                case "View All Departments":
                    // viewAllDepartments();
                    break;
                case "Add Department":
                    // addDepartment();
                    break;
                case "Quit":
                    db.end();
                    console.log('Exited program');
                    break;
            }
        });
}