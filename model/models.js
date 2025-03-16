const db = require("../db/connection");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const insertArticle = (author, title, body, topic, article_img_url) => {
  if (!article_img_url) {
    article_img_url =
      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700";
  }
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [author])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not found: Author does not exist",
        });
      }
      return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic]);
    })
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not found: Topic does not exist",
        });
      }
      return db.query(
        `INSERT INTO articles (author, title, body, topic, article_img_url) 
       VALUES ($1, $2, $3, $4, $5)
       RETURNING article_id, author, title, body, topic, article_img_url, created_at`,
        [author, title, body, topic, article_img_url]
      );
    })
    .then(({ rows }) => {
      return db.query(
        `SELECT articles.*, 
              CAST(COUNT(comments.comment_id) AS INT) AS comment_count
       FROM articles
       LEFT JOIN comments ON articles.article_id = comments.article_id
       WHERE articles.article_id = $1
       GROUP BY articles.article_id`,
        [rows[0].article_id]
      );
    })
    .then(({ rows }) => rows[0]);
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
 CAST(COUNT(comments.comment_id) AS INT) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const queryValues = [];
  const whereConditions = [];

  const doesAuthorExistPromise = author
    ? db.query(`SELECT * FROM users WHERE username = $1`, [author])
    : Promise.resolve();

  return doesAuthorExistPromise.then((authorResult) => {
    if (author && authorResult.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "author not found" });
    }

    if (author) {
      whereConditions.push(`articles.author = $${queryValues.length + 1}`);
      queryValues.push(author);
    }

    const doesTopicExistPromise = topic
      ? db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
      : Promise.resolve();

    return doesTopicExistPromise
      .then((topicResult) => {
        if (topic && topicResult.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "topic not found" });
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

        return db.query(queryString, queryValues);
      })
      .then(({ rows }) => {
        return rows;
      });
  });
};

const fetchArticlebyArticleID = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url,
      COUNT (comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      rows[0].comment_count = Number(rows[0].comment_count);
      return rows[0];
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
      return rows;
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

const updateVotesByCommentID = (comment_id, inc_votes) => {
  return db
    .query(
      `UPDATE comments 
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;`,
      [inc_votes, comment_id]
    )
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

const fetchUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "username not found..." });
      }
      return rows[0];
    });
};

module.exports = {
  fetchTopics,
  fetchArticlebyArticleID,
  fetchArticles,
  insertArticle,
  fetchCommentsByArticleID,
  insertCommentByArticleID,
  updateVotesByArticleID,
  updateVotesByCommentID,
  removeCommentbyCommentID,
  fetchUsers,
  fetchUserByUsername,
};
