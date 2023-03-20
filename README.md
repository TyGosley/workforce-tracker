# Workforce Tracker

---

## Table of Contents

---

- [Description](#description)
- [Languages](#languages)
- [Installation](#installation)
- [Usage](#usage)
- [Demonstration](#demonstration)
- [Questions](#questions)
- [Credits](#credits)
- [License](#license)

## Description

---

As a business owner, it would be helpful to be able to view and manage the departments, roles, and employees in your company and organize and plan your business. The Workforce Tracker is an application to see, store, and access all of your employee data in one spot.

This project was my introduction to mysql.  I enjoyed putting my own spin on the data.  Building the app from scratch was very challenging.  The hardest thing was knowing where to start.  If I had more time I would have fine-tuned some of the options on my prompts and added even more.

## Languages

---

This application was built using:

- JavaScript
- Node/NPM
- Inquirer
- SQL
- MySQL2

## Installation

---

1. **Copy Link:** Hit the "Code" button within this GitHub repo to copy link.
2. **Clone:** Use the command "git clone  and then *paste link here"*.

3. **NPM:** Run the command  *"npm install"* or *npm i* to install Node Package Manager and the following dependencies from the
   package.json file:

- inquirer
- MySQL2
-dotenv (optional, but recommended to protect your private information)

4. **MySql:**

- In integrated terminal, use "mysql -u _username_ -p"
- Enter your MySQL password to login
- Download database and tables to your remote workspace from the 'db' folder using commands:

  - SOURCE db/schema.sql;
  - SOURCE db/seeds.sql;

  -Once that is complete, type in quit and the server will say Bye!

## Usage

---

After following installation instructions, navigate to your integrated terminal and begin the prompt using the command *npm start* or *node server.js.*

From the main menu, select your desired option:

- View all departments
- View all roles
- View all employees
- View all employees by department
- View utilized budget by department
- Add a department
- Add a role
- Add an employee
- Update an employee role
- Remove a department
- Remove a role
- Remove an employee

Follow the prompts to add, update, or remove if chosen or simply select from the view list to access your tables.

Each selection, once completed, will bring you back to the main menu. Once your session is complete simply close the terminal.

## Demonstration

---

Click [here](https://drive.google.com/file/d/1KJ3Rt2VjQbNHkNZZ_kdWVCsOWVGwXOCY/view) to watch a demonstration for the Workforce Tracker Application.

## Questions

---

Do you have questions about this project?  
GitHub: https://github.com/TyGosley  
Email: tygosley@gmail.com

## Credits

---

[NPM](https://docs.npmjs.com/)

[Dotenv](https://www.npmjs.com/package/dotenv)

[MySQL Tutorial](https://www.mysqltutorial.org/mysql-foreign-key/)

[MySQL Docs](https://dev.mysql.com/doc/c-api/8.0/en/c-api-introduction.html)

[Codecademy](https://www.codecademy.com/learn)

[Khan Academy](https://www.khanacademy.org/)

[MDN Docs](https://developer.mozilla.org/en-US/)

[W3Schools](https://www.w3schools.com/js/default.asp)

[JavaScript.info](https://javascript.info/)

[CodeHS](https://codehs.com/)

## License

---
N/A
