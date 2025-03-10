const db = require("../db/connection");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const fetchArticlebyArticleID = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) return null;
      const article = rows[0];

      // Need to convert created_At string to be timestamp:
      return { ...article, created_at: new Date(article.created_at).getTime() };
    });
};

module.exports = { fetchTopics, fetchArticlebyArticleID };
