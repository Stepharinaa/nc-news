const express = require("express");
const {
  getArticles,
  getArticleByArticleID,
  deleteArticleByArticleID,
  patchVotesByArticleID,
  postCommentByArticleID,
  getCommentsByArticleID,
  postArticle,
} = require("../controllers/articles-controller");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.post("/", postArticle);
articlesRouter.get("/:article_id", getArticleByArticleID);
articlesRouter.delete("/:article_id", deleteArticleByArticleID);
articlesRouter.patch("/:article_id", patchVotesByArticleID);
articlesRouter.post("/:article_id/comments", postCommentByArticleID);
articlesRouter.get("/:article_id/comments", getCommentsByArticleID);

module.exports = articlesRouter;
