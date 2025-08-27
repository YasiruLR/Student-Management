# MySQL Database Setup Instructions

This guide will help you set up MySQL database for the Student Management System.

## Prerequisites

1. **Install MySQL Server**
   - Download MySQL from: https://dev.mysql.com/downloads/mysql/
   - Install MySQL Server and remember your root password
   - Start MySQL service

2. **Install MySQL Workbench (Optional but Recommended)**
   - Download from: https://dev.mysql.com/downloads/workbench/
   - This provides a GUI interface for database management

## Setup Methods

### Method 1: Automatic Setup (Recommended)

1. **Configure Environment Variables**
   ```bash
   # Edit backend/.env file and update these values:
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_root_password
   DB_NAME=student_management_system
   ```

2. **Run Automatic Setup**
   ```bash
   npm run setup-db
   ```

   This will:
   - Create the database
   - Create all required tables
   - Insert sample data
   - Create default users

### Method 2: Manual Setup

1. **Open MySQL Command Line or Workbench**

2. **Execute the SQL Script**
   ```sql
   # Copy and paste the content from database/schema.sql
   # Or in MySQL command line:
   source /path/to/your/project/database/schema.sql
   ```

## Database Structure

### Tables Created

1. **users** - Authentication and user management
   - id (Primary Key)
   - username, password, role
   - email, first_name, last_name
   - created_at, updated_at

2. **students** - Student information
   - id (Primary Key)
   - first_name, last_name, email
   - phone, date_of_birth, address
   - course, grade, status
   - enrollment_date, created_by
   - created_at, updated_at

3. **student_history** - Activity tracking
   - id (Primary Key)
   - student_id, action, performed_by
   - action_date, old_values, new_values

### Default Users

- **Admin User**
  - Username: `admin`
  - Password: `admin123`
  - Role: `admin`

- **Employee User**
  - Username: `employee`
  - Password: `emp123`
  - Role: `employee`

### Sample Students

- John Doe (Computer Science, Grade A)
- Jane Smith (Business Administration, Grade B+)
- Michael Johnson (Engineering, Grade A-)
- Emily Davis (Psychology, Grade B)

## Starting the Application

### Option 1: Run Both Frontend and Backend Together
```bash
npm run dev
```

### Option 2: Run Separately

**Terminal 1 (Backend):**
```bash
npm run server
```

**Terminal 2 (Frontend):**
```bash
npm start
```

## Testing Database Connection

1. **Start the backend server:**
   ```bash
   npm run server
   ```

2. **Test API endpoints:**
   ```bash
   # Health check
   curl http://localhost:5000/api/health

   # Login test
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

## Troubleshooting

### Common Issues

1. **"ER_ACCESS_DENIED_ERROR"**
   - Check your MySQL credentials in `.env` file
   - Ensure MySQL server is running
   - Verify user permissions

2. **"ER_BAD_DB_ERROR"**
   - Database doesn't exist
   - Run `npm run setup-db` to create it

3. **"connect ECONNREFUSED"**
   - MySQL server is not running
   - Start MySQL service
   - Check if MySQL is listening on port 3306

4. **Port conflicts**
   - Backend runs on port 5000
   - Frontend runs on port 3000
   - MySQL runs on port 3306
   - Make sure these ports are available

### MySQL Service Commands

**Windows:**
```cmd
# Start MySQL service
net start mysql80

# Stop MySQL service
net stop mysql80
```

**macOS/Linux:**
```bash
# Start MySQL
sudo systemctl start mysql

# Stop MySQL
sudo systemctl stop mysql

# Restart MySQL
sudo systemctl restart mysql
```

## Security Notes

- Change default passwords in production
- Use environment variables for sensitive data
- Consider using connection pooling for production
- Implement proper backup strategies

## Development Tools

1. **MySQL Workbench** - GUI for database management
2. **phpMyAdmin** - Web-based MySQL administration
3. **DBeaver** - Universal database tool
4. **Postman** - API testing tool

## Environment Variables Reference

```env
# Database Configuration
DB_HOST=localhost          # MySQL host
DB_USER=root              # MySQL username
DB_PASSWORD=              # MySQL password
DB_NAME=student_management_system

# Server Configuration
PORT=5000                 # Backend server port
NODE_ENV=development      # Environment

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Frontend URL
FRONTEND_URL=http://localhost:3000
```
