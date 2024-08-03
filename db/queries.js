const client = require('./connection');

const viewAllDepartments = async () => {
    const res = await client.query('SELECT * FROM department');
    return res.rows;
};

const viewAllRoles = async () => {
    const res = await client.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id');
    return res.rows;
};

const viewAllEmployees = async () => {
    const res = await client.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
                                    FROM employee 
                                    JOIN role ON employee.role_id = role.id 
                                    JOIN department ON role.department_id = department.id 
                                    LEFT JOIN employee AS manager ON employee.manager_id = manager.id`);
    return res.rows;
};

const addDepartment = async (name) => {
    await client.query('INSERT INTO department (name) VALUES ($1)', [name]);
};

const addRole = async (title, salary, departmentId) => {
    await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, departmentId]);
};

const addEmployee = async (firstName, lastName, roleId, managerId) => {
    await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, roleId, managerId]);
};

const updateEmployeeRole = async (employeeId, roleId) => {
    await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, employeeId]);
};

module.exports = {
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole
};
