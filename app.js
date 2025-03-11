const express = require("express");
const endpoints = require("./endpoints.json");
const db = require("./db/connection");
const {
  getTopics,
  getArticlebyArticleID,
  getArticles,
  getCommentsByArticleID,
} = require("./controllers/controllers");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/error-handling-controllers");

const app = express();

// Middleware I will use in future: app.use(express.json())

// refactor this later maybe?
app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpoints });
});

app.get("/api/articles", getArticles);

app.get("/api/topics", getTopics);

app.get("/api/articles/:articleid", getArticlebyArticleID);

app.get("/api/articles/:articleid/comments", getCommentsByArticleID);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found..." });
});

app.use(handlePSQLErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
