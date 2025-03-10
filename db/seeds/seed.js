const db = require("../connection");
const format = require("pg-format");
const { mapCommentsToArticleIds } = require("../seeds/utils");

const seed = async ({ topicData, userData, articleData, commentData }) => {
  try {
    await db.query(`
      DROP TABLE IF EXISTS comments;
      DROP TABLE IF EXISTS articles;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS topics;
    `);

    await db.query(`
      CREATE TABLE topics (
        slug VARCHAR(300) PRIMARY KEY,
        description VARCHAR(1000) NOT NULL,
        img_url VARCHAR(1000)
      );
      `);

    await db.query(`CREATE TABLE users (
        username VARCHAR(300) PRIMARY KEY,
        name VARCHAR(300) NOT NULL,
        avatar_url VARCHAR(1000)
      );
      `);

    await db.query(`CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(300) NOT NULL,
        topic VARCHAR(300) REFERENCES topics(slug) ON DELETE CASCADE,
        author VARCHAR(300) REFERENCES users(username) ON DELETE CASCADE,
        body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0,
        article_img_url VARCHAR(1000)
      )
      `);

    await db.query(`CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
        body TEXT NOT NULL,
        votes INT DEFAULT 0,
        author VARCHAR(300) REFERENCES users(username) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Inserting the topics
    const formattedTopics = topicData.map(({ slug, description, img_url }) => [
      slug,
      description,
      img_url,
    ]);
    const topicQuery = format(
      `INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *;`,
      formattedTopics
    );
    await db.query(topicQuery);

    // Inserting the users
    const formattedUsers = userData.map(({ username, name, avatar_url }) => [
      username,
      name,
      avatar_url,
    ]);
    const userQuery = format(
      `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;`,
      formattedUsers
    );
    await db.query(userQuery);

    // Inserting the articles
    const formattedArticles = articleData.map(
      ({ title, topic, author, body, created_at, votes, article_img_url }) => [
        title,
        topic,
        author,
        body,
        new Date(created_at), // this has to be a valid PostgreSQL timestamp according to test
        votes,
        article_img_url,
      ]
    );
    const articleQuery = format(
      `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url)
      VALUES %L RETURNING *;`,
      formattedArticles
    );
    const insertedArticles = await db.query(articleQuery);

    const updatedCommentData = mapCommentsToArticleIds(
      commentData,
      insertedArticles.rows
    );

    // Inserting the comments
    const formattedComments = updatedCommentData.map(
      ({ article_id, body, votes, author, created_at }) => [
        article_id,
        body,
        votes,
        author,
        new Date(created_at),
      ]
    );
    const commentQuery = format(
      `INSERT INTO comments (article_id, body, votes, author, created_at)
      VALUES %L RETURNING *;`,
      formattedComments
    );
    await db.query(commentQuery);

    console.log("Database seeded successfully!!");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
};

module.exports = seed;
