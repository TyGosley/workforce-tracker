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
addDepartment = () => {
  inquirer.prompt([
    {
      name: 'addDept',
      type: 'input',
      message: "What department would you like to add?",
      validate: addDept => {
        if (addDept) {
          return true;
        } else {
          console.log("Please enter a department.");
          return false;
        }
      }
    }
  ])
    .then(answer => {
      const sql = `INSERT INTO department (name) VALUES (?)`;
      connection.query(sql, answer.addDept, (err, result => {
        if (err) throw err;
        console.log(answer.addDept + 'has been added to departments!');

        showDepartments();
      }));
    });
};

// Create function to addRole
addRole = () => {
  inquirer.prompt([
    {
      name: 'role',
      type: 'input',
      message: "What role would you like to add?",
      validate: addRole => {
        if (addRole) {
          return true;
        } else {
          console.log("Please enter a role.");
          return false;
        }
      }
    },
    {
      name: 'salary',
      type: 'input',
      message: "Please input the salary for this role.",
      validate: addSalary => {
        if (isNaN(addSalary)) {
          return true;
        } else {
          console.log("Please enter a salary.");
          return false;
        }
      }
    }
  ])
    .then(answer => {
      const params = [answer.role, answer.salary];

      const roleSql = `SELECT name, id FROM department`;

      connection.promise().query(roleSql, (err, data) => {
        if (err) throw err;

        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt([
          {
            name: 'dept',
            type: 'list',
            message: "What department has this role?",
            choices: dept
          }
        ])
          .then(deptChoice => {
            const dept = deptChoice.dept;
            params.push(dept);

            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

            connection.query(sql, params, (err, results) => {
              if (err) throw err;
              console.log(answer.role + "has been added to roles!");

              showRoles();
            });
          });
      });
    });
};

// Create function to addEmployee


// Create function to updateEmployee


// Create function to updateManager


// Create function to employeeDepartment


// Create function to deleteDepartment


// Create function to deleteRole


// Create function to deleteEmployee


// Create function to viewBudget



