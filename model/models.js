const db = require("../db/connection");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const fetchArticles = (
  author,
  topic,
  sort_by = "created_at",
  order = "DESC"
) => {
  const allowedSortByColumns = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const allowedOrder = ["ASC", "DESC"];

  if (!allowedSortByColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "invalid sort_by column" });
  }

  if (!allowedOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid order value" });
  }

  let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
  COUNT(comments.comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const queryValues = [];
  const whereConditions = [];

  if (author) {
    whereConditions.push(`articles.author = $${queryValues.length + 1}`);
    queryValues.push(author);
  }

  if (topic) {
    whereConditions.push(`articles.topic = $${queryValues.length + 1}`);
    queryValues.push(topic);
  }

  if (whereConditions.length > 0) {
    queryString += ` WHERE ` + whereConditions.join(" AND ");
  }

  queryString += ` 
    GROUP BY articles.article_id
    ORDER BY articles.${sort_by} ${order}
  `;

  return db.query(queryString, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "no articles found for given query/queries",
      });
    }
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

const fetchCommentsByArticleID = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return rows.map((comment) => ({
        ...comment,
        created_at: new Date(comment.created_at).getTime(),
      }));
    });
};

const insertCommentByArticleID = (article_id, username, body) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "article not found",
        });
      }
    })
    .then(() => {
      return db
        .query(`SELECT * FROM users WHERE username = $1`, [username])
        .then(({ rows }) => {
          if (!rows.length) {
            return Promise.reject({
              status: 400,
              msg: "username not found",
            });
          }
        })
        .then(() => {
          return db.query(
            `
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING comment_id, article_id, author AS username, body, votes, created_at`,
            [article_id, username, body]
          );
        })
        .then(({ rows }) => rows[0]);
    });
};

const updateVotesByArticleID = (article_id, inc_votes) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "article not found",
        });
      }
    })
    .then(() => {
      return db.query(
        `UPDATE articles
    SET votes = votes + $1 
    WHERE article_id = $2 
    RETURNING *;`,
        [inc_votes, article_id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

const removeCommentbyCommentID = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING*;`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "comment id does not exist",
        });
      }
      return rows[0];
    });
};

const fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

module.exports = {
  fetchTopics,
  fetchArticlebyArticleID,
  fetchArticles,
  fetchCommentsByArticleID,
  insertCommentByArticleID,
  updateVotesByArticleID,
  removeCommentbyCommentID,
  fetchUsers,
};
