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
            const departmentsData = await viewAllDepartments();
            const { title, salary, departmentId } = await prompt([
                {
                    name: 'title',
                    type: 'input',
                    message: 'Enter the name of the role:'
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'Enter the salary of the role:'
                },
                {
                    name: 'departmentId',
                    type: 'list',
                    message: 'Select the department for this role:',
                    choices: departmentsData.map(department => ({ name: department.name, value: department.id }))
                }
            ]);
            await addRole(title, salary, departmentId);
            console.log(`Added ${title} to the database.`);
            break;
        case 'Add an employee':
            const rolesData = await viewAllRoles();
            const employeesData = await viewAllEmployees();
            const { firstName, lastName, roleId, managerId } = await prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: 'Enter the first name of the employee:'
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'Enter the last name of the employee:'
                },
                {
                    name: 'roleId',
                    type: 'list',
                    message: 'Select the role for this employee:',
                    choices: rolesData.map(role => ({ name: role.title, value: role.id }))
                },
                {
                    name: 'managerId',
                    type: 'list',
                    message: 'Select the manager for this employee:',
                    choices: [{ name: 'None', value: null }, ...employeesData.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))]
                }
            ]);
            await addEmployee(firstName, lastName, roleId, managerId);
            console.log(`Added ${firstName} ${lastName} to the database.`);
            break;
        case 'Update an employee role':
            break;
        case 'Exit':
            process.exit();
    }
    mainMenu();
};

mainMenu();
