const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const setupDatabase = async () => {
  let connection;

  try {
    console.log('🔄 Setting up MySQL database...');

    // Connect without specifying database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server');

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('🔄 Creating database and tables...');
    await connection.execute(schema);

    console.log('✅ Database setup completed successfully!');
    console.log('📊 Created tables: users, students, student_history');
    console.log('👤 Default users created:');
    console.log('   - Admin: username=admin, password=admin123');
    console.log('   - Employee: username=employee, password=emp123');
    console.log('👥 Sample students added for testing');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
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
