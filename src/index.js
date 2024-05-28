require("dotenv").config();
const express = require("express");
const chalk = require("chalk");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("express-async-errors");
const keys = require("./config/keys");
const authRoutes = require("./auth/auth.routes");
const setupDatabse = require("./database");
const { port } = keys;
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(helmet({ contentSecurityPolicy: false, frameguard: true }));
app.use(cors());
app.use("/api/v1/auth", authRoutes);
// setupDatabse();

// app.listen(port, () => {
//   console.log(
//     `${chalk.green("✓")} ${chalk.blue(`Listening on port ${port}.`)}`
//   );
// });

// socket
const PORT = process.env.PORT;
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((err) => console.error(err));

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting Down....");
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught promise rejection
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection! Shutting Down..");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
