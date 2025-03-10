const db = require("../db/connection");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const fetchArticlebyArticleID = (articleID) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleID])
    .then(({ rows }) => rows[0]);
};

module.exports = { fetchTopics, fetchArticlebyArticleID };
