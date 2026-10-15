# Todo CRUD App

A full-stack Todo application built with **React, Tailwind CSS, Node.js, Express, and MongoDB**. This project demonstrates the fundamentals of building a REST API and connecting it to a frontend application.

Users can create tasks, view their task list, update task details, mark tasks as completed, and delete tasks.

## Features

- **Create tasks** — Add new tasks to your list.
- **Read tasks** — Fetch and display all tasks or a single task by ID.
- **Update tasks** — Edit task titles and completion status.
- **Delete tasks** — Remove tasks from the database.
- **Input validation** — Validate task titles and completion values.
- **REST API** — Handle CRUD operations using HTTP methods.
- **Centralized error handling** — Manage errors consistently across the backend.
- **MongoDB integration** — Persist tasks using MongoDB and Mongoose.
- **Responsive UI** — Build the frontend with React and Tailwind CSS.

## Tech Stack

**Frontend**

- React
- Tailwind CSS
- Vite

**Backend**

- Node.js
- Express.js
- Mongoose
- MongoDB
- dotenv
- CORS

## Project Structure

```text
project-crud-todo/
├── frontend/
│   └── src/
│       └── App.jsx
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── toDoController.js
│   ├── middleware/
│   │   ├── not-found.js
│   │   └── errorHandler.js
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   └── toDoRoutes.js
│   ├── utils/
│   │   └── asyncWrapper.js
│   ├── .env
│   ├── app.js
│   └── package.json
│
└── README.md
```

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- A [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) account or a local MongoDB instance
- Git

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd project-crud-todo
```

Replace `<YOUR_REPOSITORY_URL>` with your GitHub repository URL.

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
```

Replace `your_mongodb_connection_string` with your MongoDB connection string.

**Important:** Never commit your `.env` file or expose your database credentials. Add `.env` to your `.gitignore` file.

Start the backend:

```bash
npm run dev
```

If your `package.json` doesn't have a `dev` script, use the appropriate script defined in it, such as:

```bash
node app.js
```

The backend should run at:

```text
http://localhost:5001
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local URL for your frontend, typically:

```text
http://localhost:5173
```

Make sure the frontend API URL points to the backend:

```text
http://localhost:5001/api/todo
```

The backend CORS configuration should allow the frontend's origin.

## API Endpoints

Base URL: `http://localhost:5001/api/todo`

| Method | Endpoint            | Description           |
| ------ | ------------------- | --------------------- |
| GET    | `/api/todo`         | Retrieve all tasks    |
| GET    | `/api/todo/:taskId` | Retrieve a task by ID |
| POST   | `/api/todo`         | Create a new task     |
| PATCH  | `/api/todo/:taskId` | Update a task         |
| DELETE | `/api/todo/:taskId` | Delete a task         |

### Create a task

**POST** `/api/todo`

Request body:

```json
{
  "title": "Learn React",
  "completed": false
}
```

A task title is required, and `completed` defaults to `false` when omitted.

### Update a task

**PATCH** `/api/todo/:taskId`

Request body:

```json
{
  "completed": true
}
```

You can update the task title, completion status, or both.

### Example task response

```json
{
  "success": true,
  "data": {
    "_id": "example_task_id",
    "title": "Learn React",
    "completed": false
  }
}
```

The ID and other database-generated fields will differ for each task.

## What I Learned

Through this project, I practiced:

- Building RESTful APIs with Express.js.
- Implementing CRUD operations with MongoDB and Mongoose.
- Organizing backend code using routes, controllers, models, and middleware.
- Using asynchronous JavaScript with `async` and `await`.
- Handling errors with an asynchronous wrapper and centralized error middleware.
- Validating incoming request data.
- Connecting a React frontend to a backend API.
- Managing application state and handling API loading and error states.
- Using environment variables to configure a backend application.

## Future Improvements

- Add user authentication and personal task lists.
- Add task filtering and sorting.
- Improve form validation and user feedback.
- Add automated tests for API endpoints.
- Deploy the frontend and backend.

## Author

Built as a learning project to practice full-stack web development with React, Express, and MongoDB.
