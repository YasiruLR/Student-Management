# Student Management System

A comprehensive React.js frontend application for managing students with role-based access for administrators and employees.

## Features

### 🎯 Core Functionality
- **Student Management**: Add, edit, view, and delete student records
- **Advanced Search**: Search students by name, email, course, or status
- **Student History**: Track all activities and changes for each student
- **Role-based Access**: Different permissions for Admin and Employee users

### 📊 Reports & Analytics
- **Overview Statistics**: Total students, active/inactive counts, average grades
- **Grade Distribution**: Visual breakdown of student performance
- **Course Enrollment**: Track enrollment across different courses
- **Detailed Reports**: Comprehensive student listings with filters
- **Export Functionality**: Export data to CSV format

### 🖨️ Print Capabilities
- Print individual student information
- Print student history reports
- Print comprehensive reports
- Professional print layouts

### 👥 User Roles

#### Admin Users
- Full access to all features
- Can delete student records
- Complete student management capabilities
- Access to all reports and analytics

#### Employee Users
- Can view and edit student information
- Can add new students
- Cannot delete student records
- Access to reports and history

## Technology Stack

- **Frontend**: React.js 18+
- **Routing**: React Router DOM
- **Icons**: React Icons (Font Awesome)
- **Printing**: React-to-Print
- **Styling**: Custom CSS with modern design
- **State Management**: React Hooks (useState, useEffect)
- **Data Storage**: Local Storage (for demo purposes)

## Installation & Setup

1. **Clone or Download** the project files

2. **Install Dependencies**
   ```bash
   cd student-management-system
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Access Application**
   - Open your browser and navigate to `http://localhost:3000`

## Demo Credentials

### Admin Account
- **Username**: admin
- **Password**: admin123
- **Permissions**: Full access including delete operations

### Employee Account
- **Username**: employee
- **Password**: emp123
- **Permissions**: Add, edit, view (no delete access)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
