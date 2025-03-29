# User Management Application

A React-based user management application that integrates with the Reqres API for user authentication and management. This application allows users to view, edit, and delete user information.

## Features

- User Authentication
- Paginated User List
- User Profile Editing
- User Deletion
- Responsive Design with Material-UI
- TypeScript Support
- Protected Routes

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
bash
git clone <repository-url>
cd reqres-user-management


2. Install dependencies:
bash
npm install
# or
yarn install


3. Start the development server:
bash
npm start
# or
yarn start


The application will be available at `http://localhost:3000`.

## API Integration

This application uses the Reqres API (https://reqres.in) for the following endpoints:

- Authentication: `POST /api/login`
- Get Users: `GET /api/users`
- Get Single User: `GET /api/users/{id}`
- Update User: `PUT /api/users/{id}`
- Delete User: `DELETE /api/users/{id}`

## Project Structure


src/
├── components/
│   ├── Login.tsx
│   ├── UserList.tsx
│   ├── UserEdit.tsx
│   └── PrivateRoute.tsx
├── context/
│   └── AuthContext.tsx
├── services/
│   └── api.ts
├── types/
│   └── index.ts
├── theme.ts
└── App.tsx


## Features in Detail

### Authentication
- Login with email and password
- JWT token-based authentication
- Protected routes
- Automatic token expiration handling

### User Management
- View paginated list of users
- Edit user information (first name, last name, email)
- Delete users
- Responsive grid layout
- Loading states and error handling

### State Management
- Context API for authentication state
- Local storage for user data persistence
- Optimistic updates for better UX

## Technologies Used

- React
- TypeScript
- Material-UI
- React Router
- Axios
- Context API

## Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

### Code Style

The project uses TypeScript and follows React best practices. ESLint and Prettier are configured for code formatting and linting.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
