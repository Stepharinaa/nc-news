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
  console.log(req.params, "<--- THIS IS REQ.PARAMS");
  console.log(req.body, "<--- THIS IS REQ.BODY");
  const { articleid } = req.params;
  const { username, body } = req.body;
  model
    .insertCommentByArticleID(articleid, username, body)
    .then((comment) => {
      console.log(comment, "<--- COMMENT RETURNED FROM DB");
      res.status(201).send({ comment: comment });
    })
    .catch(next);
};

module.exports = {
  getTopics,
  getArticlebyArticleID,
  getArticles,
  getCommentsByArticleID,
  postCommentsByArticleID,
};
