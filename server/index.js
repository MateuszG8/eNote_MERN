require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const connection = require('./db')
const userRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")
const tasksRoutes = require("./routes/tasks")
const errorHandlerMiddleware = require("./middleware/error-handler");

connection()
//middleware
app.use(express.json())
app.use(cors())
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))

// routes
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/tasks", tasksRoutes)
  