const inquirer = require('inquirer');
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
    // const inquirerStart = await import('inquirer');
    inquirer
        .prompt([
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
                    viewAllEmployees();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Quit":
                    db.end();
                    console.log('Exited program');
                    break;
            }
        });
}
function viewAllEmployees() {
    const query = "SELECT * FROM employee";
    db.query(query, (err, results) => {
        if (err) throw err;
        console.log("All Employees:");
        console.table(results);
        start();
    });
}
function addEmployee() {
    const questions = [
        {
            type: "input",
            name: "firstName",
            message: "Enter the first name of the employee:",
        },
        {
            type: "input",
            name: "lastName",
            message: "Enter the last name of the employee:",
        },
        {
            type: "input",
            name: "roleId",
            message: "Enter the role ID of the employee:",
        },
        {
            type: "input",
            name: "managerId",
            message: "Enter the manager ID of the employee (leave empty if none):",
        },
    ];

    inquirer.prompt(questions).then((answers) => {
        const { firstName, lastName, roleId, managerId } = answers;
        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        const values = [firstName, lastName, roleId, managerId];

        db.query(query, values, (err, result) => {
            if (err) throw err;
            console.log("Employee added!");
            start();
        });
    });
}
function updateEmployeeRole() {
    const employeeQuery = "SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee";
    db.query(employeeQuery, (err, employees) => {
        if (err) throw err;
    const roleQuery = "SELECT id, title FROM role";
        db.query(roleQuery, (err, roles) => {
            if (err) throw err;
        const employeeChoices = employees.map((employee) => ({
                name: employee.name,
                value: employee.id,
            }));

        const roleChoices = roles.map((role) => ({
                name: role.title,
                value: role.id,
            }));
        const questions = [
            {
                name: 'employee',
                type: 'list',
                message: 'Which employee\'s role do you want to update?',
                choices: employeeChoices
            }, 
            {
                name: 'newRole',
                type: 'list',
                message: 'Which role do you want to assign the selected employee?',
                choices: roleChoices
            }
        ];

        inquirer.prompt(questions).then((answers) => {
            const { employee, newRole } = answers;
            const query = "UPDATE employee SET role_id = ? WHERE id = ?";
            const values = [newRole, employee];

            db.query(query, values, (err, result) => {
                if (err) throw err;
                console.log("Employee role updated!");
                start();
            });
        });
    });
});
}

function viewAllRoles() {
    const query = "SELECT * FROM role";
    db.query(query, (err, results) => {
        if (err) throw err;
        console.log("All Roles:");
        console.table(results);
        start();
    });
}

function addRole() {
    const departmentQuery = "SELECT * FROM department";

    db.query(departmentQuery, (err, res) => {
        if (err) throw err;
      
        const departments = res.map((department) => ({ name: department.name, id: department.id }));
        console.log('Department Choices:', departments);

        const questions = [
            {
                type: 'input',
                name: 'newRole',
                message: 'What is the name of the role?'
            },
            {
                type: 'input',
                name: 'newSalary',
                message: 'What is the salary of the role?'
            },
            {
                name: 'selectedDepartment',
                type: 'list',
                message: 'Which department does the role belong to?',
                choices: departments
            },
        ];

        inquirer.prompt(questions).then((answers) => {
            const { newRole, newSalary, selectedDepartment } = answers;

            const roleQuery = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;


            const selectedDepartmentId = departments.find(
                (department) => department.name === selectedDepartment).id;

            db.query(roleQuery, [newRole, newSalary, selectedDepartmentId], (err, result) => {
                if (err) throw err;

                console.log("Role added!");
                start();
            });
        });
    });
}
function viewAllDepartments() {
    const query = "SELECT * FROM department";
    db.query(query, (err, results) => {
        if (err) throw err;
        console.log("All Departments:");
        console.table(results);
        start();
    });
}
function addDepartment() {
    const query = `INSERT INTO department SET ?`;
    const questions = [
        {
            name: "newDept",
            type: "input",
            message: "What is the name of the department?"
        }
    ]

    inquirer.prompt(questions).then((answers) => {
        db.query(query, {name: answers.newDept }, (err) => {
          if (err) throw err;
          console.log("Department added!");
          start();
        });
      });
    }