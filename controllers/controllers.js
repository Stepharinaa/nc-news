const model = require("../model/models");

const getTopics = (req, res, next) => {
  model
    .fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch(next);
};

const getArticles = (req, res, next) => {
  let { author, topic, sort_by, order } = req.query;

  model
    .fetchArticles(author, topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch(next);
};

const getArticlebyArticleID = (req, res, next) => {
  const article_id = req.params.articleid;
  model
    .fetchArticlebyArticleID(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

const getCommentsByArticleID = (req, res, next) => {
  const article_id = req.params.articleid;
  model
    .fetchCommentsByArticleID(article_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch(next);
};

const postCommentsByArticleID = (req, res, next) => {
  const { articleid } = req.params;
  const { username, body } = req.body;
  model
    .insertCommentByArticleID(articleid, username, body)
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch(next);
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
  getTopics,
  getArticlebyArticleID,
  getArticles,
  getCommentsByArticleID,
  postCommentsByArticleID,
  patchVotesByArticleID,
};
