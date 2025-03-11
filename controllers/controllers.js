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
  // console.log(req.query, "<-- THIS IS REQ");

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

module.exports = {
  getTopics,
  getArticlebyArticleID,
  getArticles,
  getCommentsByArticleID,
};
