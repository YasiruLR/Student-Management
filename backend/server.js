const { testConnection, executeQuery } = require('./db');

(async () => {
  await testConnection();

  // Example: get all students
  const students = await executeQuery('SELECT * FROM students');
  console.log('📌 Students:', students);

  // Example: insert new student
  await executeQuery(
    'INSERT INTO students (name, age, address, contact_number) VALUES (?, ?, ?, ?)',
    ['Kasun', 22, 'Colombo', '0771234567']
  );
  console.log('✅ New student added!');
})();
