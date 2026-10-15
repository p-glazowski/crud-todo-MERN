require('dotenv').config();
const express = require('express');
const connectToMongoDB = require('./config/db');
const routes = require('./routes/toDoRoutes');
const notFound = require('./middleware/not-found');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

//Middleware
app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);

app.use(express.json());

//Routes
app.use('/api/todo', routes);

//404 middleware
app.use(notFound);

//Centralized Error handler
app.use(errorHandler);

//Start server
const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    await connectToMongoDB();

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}...`);
    });
  } catch (err) {
    console.error('Server error:', err);
    process.exitCode = 1;
  }
}

startServer();
