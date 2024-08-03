const inquirer = require('inquirer');
const {
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
    updateEmployeeManager,
    viewEmployeesByDepartment
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
            'View employees by department',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Update an employee manager',
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
        case 'View employees by department':
            const departmentsData = await viewAllDepartments();
            const { selectedDepartmentId } = await prompt({
                name: 'selectedDepartmentId',
                type: 'list',
                message: 'Select the department to view employees:',
                choices: departmentsData.map(department => ({ name: department.name, value: department.id }))
            });
            const employeesByDepartment = await viewEmployeesByDepartment(selectedDepartmentId);
            console.table(employeesByDepartment);
            break;
        case 'Add a department':
            const { newDepartmentName } = await prompt({
                name: 'newDepartmentName',
                type: 'input',
                message: 'Enter the name of the department:'
            });
            await addDepartment(newDepartmentName);
            console.log(`Added ${newDepartmentName} to the database.`);
            break;
        case 'Add a role':
            const departmentsDataForRole = await viewAllDepartments();
            const { roleTitle, roleSalary, roleDepartmentId } = await prompt([
                {
                    name: 'roleTitle',
                    type: 'input',
                    message: 'Enter the name of the role:'
                },
                {
                    name: 'roleSalary',
                    type: 'input',
                    message: 'Enter the salary of the role:'
                },
                {
                    name: 'roleDepartmentId',
                    type: 'list',
                    message: 'Select the department for this role:',
                    choices: departmentsDataForRole.map(department => ({ name: department.name, value: department.id }))
                }
            ]);
            await addRole(roleTitle, roleSalary, roleDepartmentId);
            console.log(`Added ${roleTitle} to the database.`);
            break;
        case 'Add an employee':
            const rolesData = await viewAllRoles();
            const employeesData = await viewAllEmployees();
            const { firstName, lastName, employeeRoleId, employeeManagerId } = await prompt([
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
                    name: 'employeeRoleId',
                    type: 'list',
                    message: 'Select the role for this employee:',
                    choices: rolesData.map(role => ({ name: role.title, value: role.id }))
                },
                {
                    name: 'employeeManagerId',
                    type: 'list',
                    message: 'Select the manager for this employee:',
                    choices: [{ name: 'None', value: null }, ...employeesData.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))]
                }
            ]);
            await addEmployee(firstName, lastName, employeeRoleId, employeeManagerId);
            console.log(`Added ${firstName} ${lastName} to the database.`);
            break;
        case 'Update an employee role':
            const employeesForUpdate = await viewAllEmployees();
            const rolesForUpdate = await viewAllRoles();
            const { employeeId, newRoleId } = await prompt([
                {
                    name: 'employeeId',
                    type: 'list',
                    message: 'Select the employee to update:',
                    choices: employeesForUpdate.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
                },
                {
                    name: 'newRoleId',
                    type: 'list',
                    message: 'Select the new role for this employee:',
                    choices: rolesForUpdate.map(role => ({ name: role.title, value: role.id }))
                }
            ]);
            await updateEmployeeRole(employeeId, newRoleId);
            console.log(`Updated employee's role.`);
            break;
        case 'Update an employee manager':
            const employeesToUpdateManager = await viewAllEmployees();
            const { employeeIdForManager, newManagerId } = await prompt([
                {
                    name: 'employeeIdForManager',
                    type: 'list',
                    message: 'Select the employee to update:',
                    choices: employeesToUpdateManager.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
                },
                {
                    name: 'newManagerId',
                    type: 'list',
                    message: 'Select the new manager for this employee:',
                    choices: [{ name: 'None', value: null }, ...employeesToUpdateManager.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))]
                }
            ]);
            await updateEmployeeManager(employeeIdForManager, newManagerId);
            console.log(`Updated employee's manager.`);
            break;
        case 'Exit':
            process.exit();
    }
    mainMenu();
};

mainMenu();
