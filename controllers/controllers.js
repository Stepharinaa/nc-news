const model = require("../model/models");

const getTopics = (req, res, next) => {
  model
    .fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch(next);
};

const getArticlebyArticleID = (req, res, next) => {
  // console.log(req.params, "<-- THIS IS REQ.PARAMS");
  const article_id = req.params.articleid;
  // console.log(article_id, "<-- THIS IS ARTICLE ID");
  model
    .fetchArticlebyArticleID(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

module.exports = { getTopics, getArticlebyArticleID };
