// index.js
const inquirer = require('inquirer');
const {
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole
} = require('./db/queries');

const prompt = inquirer.createPromptModule();

const mainMenu = async () => {
    const { action } = await prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    });

    switch (action) {
        case 'View all departments':
            const departments = await viewAllDepartments();
            console.table(departments);
            break;
        case 'View all roles':
            const roles = await viewAllRoles();
            console.table(roles);
            break;
        case 'View all employees':
            const employees = await viewAllEmployees();
            console.table(employees);
            break;
        case 'Add a department':
            const { name } = await prompt({
                name: 'name',
                type: 'input',
                message: 'Enter the name of the department:'
            });
            await addDepartment(name);
            console.log(`Added ${name} to the database.`);
            break;
        case 'Add a role':
            break;
        case 'Add an employee':
            break;
        case 'Update an employee role':
            break;
        case 'Exit':
            process.exit();
    }
    mainMenu();
};

mainMenu();
