const express = require("express");
const endpoints = require("./endpoints.json");
const db = require("./db/connection");
const {
  getTopics,
  getArticlebyArticleID,
} = require("./controllers/controllers");
const {
  handlePSQLErrors,
} = require("./controllers/error-handling-controllers");

const app = express();

// Middleware I will use in future: app.use(express.json())

// refactor this later maybe?
app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:articleid", getArticlebyArticleID);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found..." });
});

app.use(handlePSQLErrors);

module.exports = app;
