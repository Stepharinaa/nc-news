const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics).toBeInstanceOf(Array);
        expect(topics.length).toBeGreaterThan(0);

        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
  test("404: Returns error message when route is invalid", () => {
    return request(app)
      .get("/api/tapicsss")
      .expect(404)
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("path not found...");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of articles for all articles, including comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeInstanceOf(Array);

        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("number");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
      });
  });
  test("200: Responds with all articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(articles).toBeInstanceOf(Array);
      });
  });

  describe("GET /api/articles with query parameters", () => {
    test("200: Responds with articles array sorted by votes ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=ASC")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toBeSortedBy("votes", { descending: false });
        });
    });
    test("400: Returns error message when given invalid sort_by column", () => {
      return request(app)
        .get("/api/articles?sort_by=random_invalid_column&order=ASC")
        .expect(400)
        .then(({ body }) => {
          const msg = body.msg;
          expect(msg).toBe("invalid sort_by column");
        });
    });
    test("400: Returns error message when given invalid order query", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=RANDOMGIVENORDER")
        .expect(400)
        .then(({ body }) => {
          const msg = body.msg;
          expect(msg).toBe("invalid order value");
        });
    });
    test("404: Returns error message when route is invalid", () => {
      return request(app)
        .get("/api/articlaass")
        .expect(404)
        .then(({ body }) => {
          const msg = body.msg;
          expect(msg).toBe("path not found...");
        });
    });
    test("200: Responds with articles array filtered by author", () => {
      return request(app)
        .get("/api/articles?author=icellusedkars")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toBeInstanceOf(Array);
          articles.forEach((article) => {
            expect(article.author).toBe("icellusedkars");
          });
        });
    });
    test("404: Returns error message when author does not exist", () => {
      return request(app)
        .get("/api/articles?author=stephiscool")
        .expect(404)
        .then(({ body }) => {
          const msg = body.msg;
          expect(msg).toBe("no articles found for given query/queries");
        });
    });
    test("200: Responds with articles array filtered by topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toBeInstanceOf(Array);
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    test("404: Returns error message when there are no articles of that topic", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(404)
        .then(({ body }) => {
          const msg = body.msg;
          expect(msg).toBe("no articles found for given query/queries");
        });
    });
    test("404: Returns error message when topic does not exist", () => {
      return request(app)
        .get("/api/articles?topic=nonexistentleagueoflegendstopic")
        .expect(404)
        .then(({ body }) => {
          const msg = body.msg;
          expect(msg).toBe("no articles found for given query/queries");
        });
    });
  });

  describe("GET /api/articles/:articleid", () => {
    test("200: Responds with article object relating to relevant article ID", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(article).toBeInstanceOf(Object);
          expect(article.title).toBe("Eight pug gifs that remind me of mitch");
          expect(article.topic).toBe("mitch");
          expect(article.author).toBe("icellusedkars");
          expect(article.body).toBe("some gifs");
          expect(new Date(article.created_at).getTime()).toBe(1604394720000);
          expect(article.votes).toBe(0);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
          expect(article.article_id).toBe(3);
        });
    });
    test("404: Returns error when article ID does not exist", () => {
      return request(app)
        .get("/api/articles/100000")
        .expect(404)
        .then(({ body }) => {
          const msg = body.msg;
          expect(msg).toBe("article not found");
        });
    });
    test("400: Returns error when article ID is not a number", () => {
      return request(app)
        .get("/api/articles/notAnIDorNumber")
        .expect(400)
        .then(({ body }) => {
          const msg = body.msg;
          expect(msg).toBe("invalid article ID");
        });
    });
  });
});

describe("GET /api/articles/:articleid/comments", () => {
  test("200: Returns array of comments for given article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBeGreaterThan(0);

        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("number");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("200: Comments should be returned with most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
});
