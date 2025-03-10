const { getArticlebyArticleID } = require("../controllers/controllers");
const db = require("../db/connection");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const fetchArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      // console.log(rows, "<--- THESE ARE THE ROWS");
      return rows.map((article) => {
        return {
          ...article,
          created_at: new Date(article.created_at).getTime(),
        };
      });
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

module.exports = { fetchTopics, fetchArticlebyArticleID, fetchArticles };
