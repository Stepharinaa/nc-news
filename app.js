const express = require("express");
const endpoints = require("./endpoints.json");
const db = require("./db/connection");
const {
  getTopics,
  getArticlebyArticleID,
  getArticles,
  getCommentsByArticleID,
  postCommentsByArticleID,
  patchVotesByArticleID,
} = require("./controllers/controllers");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/error-handling-controllers");

const app = express();

app.use(express.json());

// refactor this later maybe?
app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpoints });
});

app.get("/api/articles", getArticles);

app.get("/api/topics", getTopics);

app.get("/api/articles/:articleid", getArticlebyArticleID);

app.patch("/api/articles/:article_id", patchVotesByArticleID);

app.get("/api/articles/:articleid/comments", getCommentsByArticleID);

app.post("/api/articles/:articleid/comments", postCommentsByArticleID);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found..." });
});

app.use(handlePSQLErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
