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
          "View all employees by manager",
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
        case "View all employees by manager":
          viewEmployeesByManager();
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
        case "View employees by department":
          employeeByDepartment();
          break;
        case "Delete a department":
          deleteDepartment();
          break;
        case "Delete a role":
          deleteRole();
          break;
        case "Delete an employee":
          deleteEmployee();
          break;
        case "View department budgets":
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

// Create function to addRole
// addRole = () => {
//   inquirer.prompt([
//     {
//       name: 'role',
//       type: 'input',
//       message: "What role would you like to add?",
//       validate: addRole => {
//         if (addRole) {
//           return true;
//         } else {
//           console.log("Please enter a role.");
//           return false;
//         }
//       }
//     },
//     {
//       name: 'salary',
//       type: 'input',
//       message: "Please input the salary for this role.",
//       validate: addSalary => {
//         if (isNaN(addSalary)) {
//           return false;
//         } else {
//           console.log("Please enter a salary.");
//           return true;
//         }
//       }
//     }
//   ])
//   .then(answer => {
//     const params = [answer.role, answer.salary];

//     const roleSql = `SELECT name, id FROM department`;

//     db.promise().query(roleSql, (err, data) => {
//       if (err) throw err;

//       const dept = data.map(({ name, id }) => ({ name: name, value: id }));

//       inquirer.prompt([
//         {
//           name: 'dept',
//           type: 'list',
//           message: "What department has this role?",
//           choices: dept
//         }
//       ])
//       .then(deptChoice => {
//         const dept = deptChoice.dept;
//         params.push(dept);

//         const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

//         db.query(sql, params, (err, results) => {
//           if (err) throw err;
//           console.log(answer.role + "has been added to roles!");

//           showRoles();
//         });
//       });
//     });
//   });
// };

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

// BONUS: create function to viewEmployeeByManager
viewEmployeesByManager = (managerId) => {
  console.log(`Showing all employees managed by ${managerId}`);
  //   const sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary
  //                FROM employee e
  //                LEFT JOIN role r ON e.role_id = r.id
  //                LEFT JOIN department d ON r.department_id = d.id
  //                WHERE e.manager_id = ?`;

  //   db.promise().query(sql, managerId)
  //     .then(([rows]) => {
  //       console.table(rows);
  //       promptUser();
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       promptUser();
  //     });
  // };
  const sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary
             FROM employee e
             LEFT JOIN role r ON e.role_id = r.id
             LEFT JOIN department d ON r.department_id = d.id
             WHERE e.manager_id = :managerId`;

  db.promise()
    .query(sql, { managerId })
    .then(([rows]) => {
      console.table(rows);
      promptUser();
    })
    .catch((err) => {
      console.error(err);
      promptUser();
    });
};

// Bonus: Create function to employeeDepartment
employeeByDepartment = () => {
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

// Bonus: Create function to deleteDepartment
// deleteDepartment = () => {
//   const deptSql = `SELECT * FROM department`;

//   db.promise().query(deptSql, (err, data) => {
//     if (err) throw err;

//     const dept = data.map(({ name, id }) => ({ name: name, value: id }));

//     inquirer.prompt([
//       {
//         name: 'dept',
//         type: 'list',
//         message: "Which department would you like to delete?",
//         choices: dept
//       }
//     ])
//       .then(deptChoice => {
//         const dept = deptChoice.dept;
//         const sql = `DELETE FROM department WHERE id = ?`;

//         db.query(sql, dept, (err, result) => {
//           if (err) throw err;
//           console.log("Department is successfully deleted!");

//         showDepartments();
//       });
//     });
//   });
// };

// // Create function to deleteRole
// deleteRole = () => {
//   const roleSql = `SELECT * FROM role`;

//   db.promise().query(roleSql, (err, data) => {
//     if (err) throw err;

//     const role = data.map(({ title, id }) => ({ name: title, value: id }));

//     inquirer.prompt([
//       {
//         name: 'role',
//         type: 'list',
//         message: "Which role would you like to delete?",
//         choices: role
//       }
//     ])
//       .then(roleChoice => {
//         const role = roleChoice.role;
//         const sql = `DELETE FROM role WHERE id = ?`;

//         db.query(sql, role, (err, result) => {
//           if (err) throw err;
//           console.log("Role is successfully deleted!");

//           showRoles();
//       });
//     });
//   });
// };

// // Create function to deleteEmployee
// deleteEmployee = () => {
//   // get employees from employee table
//   const employeeSql = `SELECT * FROM employee`;

//   db.promise().query(employeeSql, (err, data) => {
//     if (err) throw err;

//   const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

//     inquirer.prompt([
//       {
//         name: 'name',
//         type: 'list',
//         message: "Which employee would you like to delete?",
//         choices: employees
//       }
//     ])
//       .then(employeeChoice => {
//         const employee = employeeChoice.name;

//         const sql = `DELETE FROM employee WHERE id = ?`;

//         db.query(sql, employee, (err, result) => {
//           if (err) throw err;
//           console.log("Employee is successfully deleted!");

//           showEmployees();
//     });
//   });
//  });
// };

// Create function to viewBudget
// viewBudget = () => {
//   console.log('Showing budget by department...\n');

//   const sql = `SELECT department_id AS id, department.name AS department, SUM(salary) AS budget
//       FROM  role
//       JOIN department ON role.department_id = department.id GROUP BY  department_id`;

//   db.promise().query(sql, (err, rows) => {
//     if (err) throw err;
//     console.table(rows);

//     promptUser();
//   });
// };

promptUser();
