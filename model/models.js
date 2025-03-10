const db = require("../db/connection");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const fetchArticlebyArticleID = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "invalid article ID" });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      const article = rows[0];

      // Need to convert created_At string to be timestamp:
      return { ...article, created_at: new Date(article.created_at).getTime() };
    });
};

module.exports = { fetchTopics, fetchArticlebyArticleID };
