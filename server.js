// Import tables
const inquirer = require('inquirer');
const mysql = require('mysql2');

// require encrypted connection to database
require('dotenv').config();
const db = mysql.createConnection({
  host: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'shield_db'
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
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;

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
addEmployee = () => {
  inquirer.prompt([
    {
      name: 'firstName',
      type: 'input',
      message: "What is the employee's first name?",
      validate: addFirstName => {
        if (addFirstName) {
          return true;
        } else {
          console.log("Please enter a first name.");
          return false;
        }
      }
    },
    {
      name: 'lastName',
      type: 'input',
      message: "What is the employee's last name?",
      validate: addLastName => {
        if (addLastName) {
          return true;
        } else {
          console.log("Please enter a last name.");
          return false;
        }
      }
    }
  ])
    .then(answer => {
      const params = [answers.firstName, answer.lastName]
      const roleSql = `SELECT role.id, role.title FROM role`;

      connection.promise().query(roleSql, (err, data) => {
        if (err) throw err;

        const roles = data.map(({ id, title }) => ({ name: title, value: id }));

        inquirer.prompt([
          {
            name: 'role',
            type: 'list',
            message: "What is the employee's role?",
            choices: roles
          }
        ])
          .then(roleChoice => {
            const role = roleChoice.role;
            params.push(role);

            const managerSql = `SELECT * FROM employee`;

            connection.promise().query(managerSql, (err, data) => {
              if (err) throw err;

              const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

              inquirer.prompt([
                {
                  name: 'manager',
                  type: 'input',
                  message: "Who is the employee's manager?",
                  choices: managers
                }
              ])
                .then(managerChoice => {
                  const manager = managerChoice.manager;
                  params.push(manager);

                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

                  connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log("The employee has been added!")

                    showEmployees();
                  });
                });
            });
          });
      });
    });
};

// Create function to updateEmployee
updateEmployee = () => {
  const employeeSql = `SELECT * FROM employee`;

  connection.promise().query(employeeSql, (err, data) => {
    if (err) throw err;

    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

    inquirer.prompt([
      {
        name: 'name',
        type: 'list',
        message: "Which employee would you like to update?",
        choices: employees
      }
    ])
      .then(employeeChoice => {
        const employee = employeeChoice.name;
        const params = [];
        params.push(employee);

        const roleSql = `SELECT * FROM role`;

        connection.promise().query(roleSql, (err, data) => {
          if (err) throw err;

          const roles = data.map(({ id, title }) => ({ name: title, value: id }));

          inquirer.prompt([
            {
              name: 'role',
              type: 'list',
              message: "What is the employee's new role?",
              choices: roles
            }
          ])
            .then(roleChoice => {
              const role = roleChoice.role;
              params.push(role);

              let employee = params[0]
              params[0] = role
              params[1] = employee

              const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

              connection.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log("Employee has been updated!");

                showEmployees();
              });
            });
        });
      });
  });
};

// Create function to updateManager
updateManager = () => {
  // get employees from employee table 
  const employeeSql = `SELECT * FROM employee`;

  connection.promise().query(employeeSql, (err, data) => {
    if (err) throw err;

    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

    inquirer.prompt([
      {
        name: 'name',
        type: 'list',
        message: "Which employee would you like to update?",
        choices: employees
      }
    ])
      .then(employeeChoice => {
        const employee = employeeChoice.name;
        const params = [];
        params.push(employee);

        const managerSql = `SELECT * FROM employee`;

        connection.promise().query(managerSql, (err, data) => {
          if (err) throw err;

          const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

          inquirer.prompt([
            {
              name: 'manager',
              type: 'list',
              message: "Who is the employee's manager?",
              choices: managers
            }
          ])
            .then(managerChoice => {
              const manager = managerChoice.manager;
              params.push(manager);

              let employee = params[0]
              params[0] = manager
              params[1] = employee

              const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

              connection.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log("Employee has been updated!");

                showEmployees();
              });
            });
        });
      });
  });
};

// Create function to employeeDepartment
employeeDepartment = () => {
  console.log('Showing employee by departments');
  const sql = `SELECT employee.first_name, employee.last_name, department.name AS department
      FROM employee 
      LEFT JOIN role ON employee.role_id = role.id 
      LEFT JOIN department ON role.department_id = department.id`;

  connection.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

// Create function to deleteDepartment
deleteDepartment = () => {
  const deptSql = `SELECT * FROM department`; 

  connection.promise().query(deptSql, (err, data) => {
    if (err) throw err; 

    const dept = data.map(({ name, id }) => ({ name: name, value: id }));

    inquirer.prompt([
      {
        name: 'dept',
        type: 'list', 
        message: "Which department would you like to delete?",
        choices: dept
      }
    ])
      .then(deptChoice => {
        const dept = deptChoice.dept;
        const sql = `DELETE FROM department WHERE id = ?`;

        connection.query(sql, dept, (err, result) => {
          if (err) throw err;
          console.log("Department is successfully deleted!"); 

        showDepartments();
      });
    });
  });
};

// Create function to deleteRole
deleteRole = () => {
  const roleSql = `SELECT * FROM role`; 

  connection.promise().query(roleSql, (err, data) => {
    if (err) throw err; 

    const role = data.map(({ title, id }) => ({ name: title, value: id }));

    inquirer.prompt([
      {
        name: 'role',
        type: 'list', 
        message: "Which role would you like to delete?",
        choices: role
      }
    ])
      .then(roleChoice => {
        const role = roleChoice.role;
        const sql = `DELETE FROM role WHERE id = ?`;

        connection.query(sql, role, (err, result) => {
          if (err) throw err;
          console.log("Role is successfully deleted!"); 

          showRoles();
      });
    });
  });
};

// Create function to deleteEmployee
deleteEmployee = () => {
  // get employees from employee table 
  const employeeSql = `SELECT * FROM employee`;

  connection.promise().query(employeeSql, (err, data) => {
    if (err) throw err; 

  const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
      {
        name: 'name',
        type: 'list',
        message: "Which employee would you like to delete?",
        choices: employees
      }
    ])
      .then(employeeChoice => {
        const employee = employeeChoice.name;

        const sql = `DELETE FROM employee WHERE id = ?`;

        connection.query(sql, employee, (err, result) => {
          if (err) throw err;
          console.log("Employee is successfully deleted!");
        
          showEmployees();
    });
  });
 });
};

// Create function to viewBudget
viewBudget = () => {
  console.log('Showing budget by department...\n');

  const sql = `SELECT department_id AS id, department.name AS department, SUM(salary) AS budget
      FROM  role  
      JOIN department ON role.department_id = department.id GROUP BY  department_id`;
  
  connection.promise().query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows);

    promptUser(); 
  });            
};


