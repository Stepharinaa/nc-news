const express = require("express");
const {
  getArticles,
  getArticleByArticleID,
  patchVotesByArticleID,
  postCommentByArticleID,
  getCommentsByArticleID,
} = require("../controllers/articles-controller");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleByArticleID);
articlesRouter.patch("/:article_id", patchVotesByArticleID);
articlesRouter.post("/:article_id/comments", postCommentByArticleID);
articlesRouter.get("/:article_id/comments", getCommentsByArticleID);

module.exports = articlesRouter;
