// Import tables
const inquirer = require('inquirer');
const mysql = require('mysql2');

// require encrypted connection to database
require('dotenv').config();
const db = mysql.createConnection({
  host: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'employee_db'
});

db.connect(err => {
  if (err) throw err;
});

//   Prompt User function and ask what they want to do
const promptUser = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'menu',
      message: 'What would you like to do?',
      choices: [
        new inquirer.Separator('-----VIEW TABLES-----'),
        'View all departments',
        'View all roles',
        'View all employees by manager',
        'View all employees by department',
        'View utilized budget by department',
        new inquirer.Separator('-----ADD TO TABLES-----'),
        'Add a department',
        'Add a role',
        'Add an employee',
        new inquirer.Separator('-----UPDATE TABLES-----'),
        'Update an employee role',
        new inquirer.Separator('-----REMOVE COLUMNS FROM TABLES-----'),
        'Remove a department',
        'Remove a role',
        'Remove an employee'
      ]
    }
  ])
    .then((answers) => {
      const { UserChoice } = answers;

      if (UserChoice === "View all departments") {
        showDepartments();
      }

      if (UserChoice === "View all roles") {
        showRoles();
      }

      if (UserChoice === "View all employees") {
        showEmployees();
      }

      if (UserChoice === "Add a department") {
        addDepartment();
      }

      if (UserChoice === "Add a role") {
        addRole();
      }

      if (UserChoice === "Add an employee") {
        addEmployee();
      }

      if (UserChoice === "Update an employee role") {
        updateEmployee();
      }

      if (UserChoice === "Update an employee manager") {
        updateManager();
      }

      if (UserChoice === "View employees by department") {
        employeeDepartment();
      }

      if (UserChoice === "Delete a department") {
        deleteDepartment();
      }

      if (UserChoice === "Delete a role") {
        deleteRole();
      }

      if (UserChoice === "Delete an employee") {
        deleteEmployee();
      }

      if (UserChoice === "View department budgets") {
        viewBudget();
      }

      if (UserChoice === "No Action") {
        connection.end()
      };
    });
};

//   Create function to showDepartments
showDepartments = () => {
  console.log('Showing all departments');
  const sql = `SELECT department.id AS id, department.name AS department FROM department`;

  db.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

// Create function to showRoles   
showRoles = () => {
  console.log('Showing all roles')
  const sql = `SELECT role.id, role.title, department.name AS department FROM role
      INNER JOIN department ON role.department_id = department.id`;

  db.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
    });
};

// Create function to showEmployees
showEmployees = () => {
  console.log('SHowing all employees');
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department
    role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee 
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_if = manager.id`;

    db.promise().query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      promptUser();
      });
};

// Create function to addDepartment


// Create function to addRole


// Create function to addEmployee


// Create function to updateEmployee


// Create function to updateManager


// Create function to employeeDepartment


// Create function to deleteDepartment


// Create function to deleteRole


// Create function to deleteEmployee


// Create function to viewBudget



