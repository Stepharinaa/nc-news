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

const postArticle = (req, res, next) => {
  let { author, title, body, topic, article_img_url } = req.body;

  if (!author || !title || !body || !topic) {
    return res
      .status(400)
      .send({ msg: "Bad Request: Missing required fields..." });
  }

  if (
    typeof author !== "string" ||
    typeof title !== "string" ||
    typeof body !== "string" ||
    typeof topic !== "string" ||
    (article_img_url !== undefined && typeof article_img_url !== "string")
  ) {
    return res.status(400).send({ msg: "Invalid data type" });
  }
  model
    .insertArticle(author, title, body, topic, article_img_url)
    .then((article) => {
      res.status(201).send({ article: article });
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
      if (!comments.length) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
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
  postArticle,
};
