const model = require("../model/models");

const getArticles = (req, res, next) => {
  let { author, topic, sort_by, order } = req.query;

  model
    .fetchArticles(author, topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch(next);
};

const getArticleByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  model
    .fetchArticlebyArticleID(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

const getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  model
    .fetchCommentsByArticleID(article_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch(next);
};

const postCommentByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!username || !body) {
    return next({
      status: 400,
      msg: "comment could not be added as field(s) are missing",
    });
  }
  model
    .insertCommentByArticleID(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch((err) => {
      if (err.code === "23503") {
        next({ status: 400, msg: "username not found" });
      } else {
        next(err);
      }
    });
};

const patchVotesByArticleID = (req, res, next) => {
  const keys = Object.keys(req.body);
  if (!keys.length) {
    return next({ status: 400, msg: "bad request..." });
  }
  if (keys.length !== 1 || keys[0] !== "inc_votes") {
    return next({ status: 400, msg: "unexpected field in request body" });
  }
  if (typeof req.body.inc_votes !== "number") {
    return next({ status: 400, msg: "inc_votes must be a number" });
  }

  const { article_id } = req.params;
  const { inc_votes } = req.body;
  model
    .updateVotesByArticleID(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

module.exports = {
  getArticleByArticleID,
  getArticles,
  getCommentsByArticleID,
  postCommentByArticleID,
  patchVotesByArticleID,
};
