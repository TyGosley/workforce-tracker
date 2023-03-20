// Import tables
const inquirer = require("inquirer");
const mysql = require("mysql2");

// require encrypted connection to database
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  console.log("Connected to the tracker_db database!")
);

//   Prompt User function and ask what they want to do
const promptUser = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: [
          new inquirer.Separator("-----VIEW TABLES-----"),
          "View all departments",
          "View all roles",
          "View all employees",
          "View all employees by department",
          "View utilized budget by department",
          new inquirer.Separator("-----ADD TO TABLES-----"),
          "Add a department",
          "Add a role",
          "Add an employee",
          new inquirer.Separator("-----UPDATE TABLES-----"),
          "Update an employee role",
          new inquirer.Separator("-----REMOVE COLUMNS FROM TABLES-----"),
          "Remove a department",
          "Remove a role",
          "Remove an employee",
        ],
      },
    ])
    .then((answers) => {
      const { menu } = answers;

      switch (menu) {
        case "View all departments":
          showDepartments();
          break;
        case "View all roles":
          showRoles();
          break;
        case "View all employees":
          showEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployee();
          break;
        case "View all employees by department":
          viewEmployeeByDepartment();
          break;
        case "Remove a department":
          removeDepartment();
          break;
        case "Remove a role":
          removeRole();
          break;
        case "Remove an employee":
          removeEmployee();
          break;
        case "View utilized budget by department":
          viewBudget();
          break;
        case "No Action":
          connection.end();
          break;
        default:
          // Handle invalid menu options
          break;
      }
    });
};
//   Create function to showDepartments
showDepartments = () => {
  console.log("Showing all departments");
  const sql = `SELECT department.id AS id, department.name AS department FROM department`;

  db.promise()
    .query(sql)
    .then(([rows]) => {
      console.table(rows);
      promptUser();
    })
    .catch((err) => {
      console.error(err);
      promptUser();
    });
};

// Create function to showRoles
showRoles = () => {
  console.log("Showing all roles");
  const sql = `SELECT role.id, role.title, department.name AS department FROM role
      INNER JOIN department ON role.department_id = department.id`;

  db.promise()
    .query(sql)
    .then(([rows]) => {
      console.table(rows);
      promptUser();
    })
    .catch((err) => {
      throw err;
    });
};

// Create function to showEmployees
showEmployees = () => {
  console.log("Showing all employees");
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department,
    role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee 
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  db.promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.table(rows);
      promptUser();
    })
    .catch((err) => {
      throw err;
    });
};

// Create function to addDepartment
addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "addDept",
        type: "input",
        message: "What department would you like to add?",
        validate: (addDept) => {
          if (addDept) {
            return true;
          } else {
            console.log("Please enter a department.");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO department (name) VALUES (?)`;
      db.promise()
        .query(sql, answer.addDept)
        .then((result) => {
          console.log(answer.addDept + " has been added to departments!");
          showDepartments();
        })
        .catch((err) => {
          console.error(err);
        });
    });
};


addRole = () => {
  inquirer
    .prompt([
      {
        name: "role",
        type: "input",
        message: "What role would you like to add?",
        validate: (addRole) => {
          if (addRole) {
            return true;
          } else {
            console.log("Please enter a role.");
            return false;
          }
        },
      },
      {
        name: "salary",
        type: "input",
        message: "Please input the salary for this role.",
        validate: (addSalary) => {
          if (isNaN(addSalary)) {
            return false;
          } else {
            console.log("Please enter a salary.");
            return true;
          }
        },
      },
    ])
    .then((answer) => {
      const params = [answer.role, answer.salary];

      const roleSql = `SELECT name, id FROM department`;

      db.promise()
        .query(roleSql)
        .then(([rows, fields]) => {
          const dept = rows.map(({ name, id }) => ({ name: name, value: id }));

          inquirer
            .prompt([
              {
                name: "dept",
                type: "list",
                message: "What department has this role?",
                choices: dept,
              },
            ])
            .then((deptChoice) => {
              const dept = deptChoice.dept;
              params.push(dept);

              const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

              db.promise()
                .execute(sql, params)
                .then(([rows, fields]) => {
                  console.log(answer.role + " has been added to roles!");

                  showRoles();
                })
                .catch((err) => console.error(err));
            });
        })
        .catch((err) => console.error(err));
    });
};

// Create function to addEmployee
addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?",
        validate: (addFirstName) => {
          if (addFirstName) {
            return true;
          } else {
            console.log("Please enter a first name.");
            return false;
          }
        },
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?",
        validate: (addLastName) => {
          if (addLastName) {
            return true;
          } else {
            console.log("Please enter a last name.");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const params = [answer.firstName, answer.lastName];
      const roleSql = `SELECT role.id, role.title FROM role`;

      db.promise()
        .query(roleSql)
        .then(([data, fields]) => {
          const roles = data.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          inquirer
            .prompt([
              {
                name: "role",
                type: "list",
                message: "What is the employee's role?",
                choices: roles,
              },
            ])
            .then((roleChoice) => {
              const role = roleChoice.role;
              params.push(role);

              const managerSql = `SELECT * FROM employee`;

              db.promise()
                .query(managerSql)
                .then(([data, fields]) => {
                  const managers = data.map(
                    ({ id, first_name, last_name }) => ({
                      name: first_name + " " + last_name,
                      value: id,
                    })
                  );
                  managers.push({ name: "No manager", value: null });

                  inquirer
                    .prompt([
                      {
                        name: "manager",
                        type: "list",
                        message: "Who is the employee's manager?",
                        choices: managers,
                      },
                    ])
                    .then((managerChoice) => {
                      const manager = managerChoice.manager;
                      params.push(manager);

                      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

                      db.promise()
                        .query(sql, params)
                        .then(([result, fields]) => {
                          console.log("The employee has been added!");
                          showEmployees();
                        })
                        .catch((err) => console.error(err));
                    });
                })
                .catch((err) => console.error(err));
            });
        })
        .catch((err) => console.error(err));
    });
};

// Create function to updateEmployee
updateEmployee = () => {
  const employeeSql = `SELECT * FROM employee`;

  db.promise()
    .query(employeeSql)
    .then(([data]) => {
      const employees = data.map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name,
        value: id,
      }));

      inquirer
        .prompt([
          {
            name: "name",
            type: "list",
            message: "Which employee would you like to update?",
            choices: employees,
          },
        ])
        .then((employeeChoice) => {
          const employee = employeeChoice.name;
          const params = [];
          params.push(employee);

          const roleSql = `SELECT * FROM role`;

          db.promise()
            .query(roleSql)
            .then(([data]) => {
              const roles = data.map(({ id, title }) => ({
                name: title,
                value: id,
              }));

              inquirer
                .prompt([
                  {
                    name: "role",
                    type: "list",
                    message: "What is the employee's new role?",
                    choices: roles,
                  },
                ])
                .then((roleChoice) => {
                  const role = roleChoice.role;
                  params.push(role);

                  let employee = params[0];
                  params[0] = role;
                  params[1] = employee;

                  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                  db.promise()
                    .query(sql, params)
                    .then(() => {
                      console.log("Employee has been updated!");

                      showEmployees();
                    })
                    .catch((err) => {
                      console.error(err);
                      promptUser();
                    });
                })
                .catch((err) => {
                  console.error(err);
                  promptUser();
                });
            })
            .catch((err) => {
              console.error(err);
              promptUser();
            });
        })
        .catch((err) => {
          console.error(err);
          promptUser();
        });
    })
    .catch((err) => {
      console.error(err);
      promptUser();
    });
};

// Bonus: Create function to viewEmployeeDepartment
viewEmployeeByDepartment = () => {
  console.log("Showing employees by departments");
  const sql = `SELECT employee.first_name, employee.last_name, department.name AS department
      FROM employee 
      LEFT JOIN role ON employee.role_id = role.id 
      LEFT JOIN department ON role.department_id = department.id`;

  db.promise()
    .query(sql)
    .then(([rows]) => {
      console.table(rows);
      promptUser();
    })
    .catch((err) => {
      console.error(err);
      promptUser();
    });
};

// Bonus: Create function to viewBudget
viewBudget = () => {
  console.log('Showing budget by department...\n');

  const sql = `SELECT department_id AS id, 
                      department.name AS department,
                      SUM(salary) AS budget
               FROM  role  
               JOIN department ON role.department_id = department.id GROUP BY  department_id`;
  
  db.promise().query(sql)
    .then((rows) => {
      console.table(rows[0]);

      promptUser(); 
    })
    .catch((err) => {
      throw err;
    });
};


// Bonus: Create function to removeDepartment
removeDepartment = async () => {
  try {
    const [data] = await db.promise().query(`SELECT * FROM department`);
    const dept = data.map(({ name, id }) => ({ name: name, value: id }));

    const deptChoice = await inquirer.prompt([
      {
        name: 'dept',
        type: 'list',
        message: "Which department would you like to remove?",
        choices: dept
      }
    ]);

    const deptId = deptChoice.dept;
    const [result] = await db.promise().query(`DELETE FROM department WHERE id = ?`, deptId);
    console.log("Department is successfully removed!");
    showDepartments();
  } catch (err) {
    throw err;
  }
};

// // Create function to removeRole
removeRole = async () => {
  try {
    const [data] = await db.promise().query(`SELECT * FROM role`);
    const role = data.map(({ title, id }) => ({ name: title, value: id }));

    const roleChoice = await inquirer.prompt([
      {
        name: 'role',
        type: 'list',
        message: "Which role would you like to remove?",
        choices: role
      }
    ]);

    const roleId = roleChoice.role;
    const [result] = await db.promise().query(`DELETE FROM role WHERE id = ?`, roleId);
    console.log("Role is successfully removed!");
    showRoles();
  } catch (err) {
    throw err;
  }
};


// // Create function to removeEmployee
removeEmployee = async () => {
  try {
    const [data] = await db.promise().query(`SELECT * FROM employee`);
    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

    const employeeChoice = await inquirer.prompt([
      {
        name: 'name',
        type: 'list',
        message: "Which employee would you like to remove?",
        choices: employees
      }
    ]);

    const employeeId = employeeChoice.name;

    const [result] = await db.promise().query(`DELETE FROM employee WHERE id = ?`, employeeId);
    console.log("Employee is successfully removed!");
    showEmployees();
  } catch (err) {
    throw err;
  }
};


promptUser();
