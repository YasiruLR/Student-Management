const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const setupDatabase = async () => {
  console.log('🚀 Student Management System - Database Setup');
  console.log('================================================');
  console.log('');

  // Check if environment variables are set
  if (!process.env.DB_USER) {
    console.log('❌ Database configuration missing!');
    console.log('');
    console.log('📋 Please follow these steps:');
    console.log('1. Make sure MySQL is installed and running');
    console.log('2. Edit backend/.env file with your MySQL credentials:');
    console.log('   DB_HOST=localhost');
    console.log('   DB_USER=your_mysql_username');
    console.log('   DB_PASSWORD=your_mysql_password');
    console.log('3. Run this setup again: npm run setup-db');
    console.log('');
    console.log('💡 Default MySQL credentials are often:');
    console.log('   Username: root');
    console.log('   Password: (empty) or root or admin');
    return;
  }

  let connection;

  try {
    console.log('🔄 Connecting to MySQL server...');
    console.log(`📍 Host: ${process.env.DB_HOST}`);
    console.log(`👤 User: ${process.env.DB_USER}`);
    console.log('');

    // Connect without specifying database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('✅ Successfully connected to MySQL server!');
    console.log('');

    // Check if database exists
    const [databases] = await connection.execute('SHOW DATABASES LIKE ?', [process.env.DB_NAME]);
    
    if (databases.length > 0) {
      console.log(`⚠️  Database '${process.env.DB_NAME}' already exists.`);
      console.log('This will recreate all tables and data.');
      console.log('');
    }

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.log('❌ Schema file not found!');
      console.log(`Expected location: ${schemaPath}`);
      return;
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('🔄 Creating database and tables...');
    await connection.execute(schema);

    console.log('✅ Database setup completed successfully!');
    console.log('');
    console.log('📊 Created:');
    console.log('   ├── Database: student_management_system');
    console.log('   ├── Tables: users, students, student_history');
    console.log('   ├── Indexes: for better performance');
    console.log('   └── Sample data: users and students');
    console.log('');
    console.log('👤 Default Users Created:');
    console.log('   ├── Admin: username=admin, password=admin123');
    console.log('   └── Employee: username=employee, password=emp123');
    console.log('');
    console.log('👥 Sample Students Added:');
    console.log('   ├── John Doe (Computer Science)');
    console.log('   ├── Jane Smith (Business Administration)');
    console.log('   ├── Michael Johnson (Engineering)');
    console.log('   └── Emily Davis (Psychology)');
    console.log('');
    console.log('🚀 Ready to start! Run: npm run server');

  } catch (error) {
    console.log('❌ Database setup failed!');
    console.log('');
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('🔒 Access denied! Please check:');
      console.log('   ├── MySQL username and password in backend/.env');
      console.log('   ├── MySQL server is running');
      console.log('   └── User has permission to create databases');
      console.log('');
      console.log('💡 Try these common credentials:');
      console.log('   ├── Username: root, Password: (empty)');
      console.log('   ├── Username: root, Password: root');
      console.log('   └── Username: root, Password: admin');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('🔌 Connection refused! Please check:');
      console.log('   ├── MySQL server is installed and running');
      console.log('   ├── MySQL is listening on port 3306');
      console.log('   └── Host address is correct');
      console.log('');
      console.log('🔧 To start MySQL:');
      console.log('   Windows: net start mysql80');
      console.log('   Mac/Linux: sudo systemctl start mysql');
    } else {
      console.log('📋 Error details:', error.message);
    }
    
    console.log('');
    console.log('📖 For detailed setup instructions, see: DATABASE_SETUP.md');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
