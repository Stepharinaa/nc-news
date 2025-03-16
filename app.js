const express = require("express");
const endpoints = require("./endpoints.json");
const articlesRouter = require("./routes/articles-router");
const topicsRouter = require("./routes/topics-router");
const commentsRouter = require("./routes/comments-router");
const usersRouter = require("./routes/users-router");

const {
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/error-handling-controllers");

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpoints });
});

app.use("/api/topics", topicsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/users", usersRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found..." });
});

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
