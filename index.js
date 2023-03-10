// Import tables
const inquirer = require('inquirer');
const mysql = require('mysql2');

// require encrypted connection
require('dotenv').config();
const connection = mysql.createConnection({
    host: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'employee_db'
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


// Create function to showRoles   


// Create function to showEmployees


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



