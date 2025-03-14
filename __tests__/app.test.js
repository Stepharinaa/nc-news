const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data");
const users = require("../db/data/test-data/users.js");

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
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
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
    test("200: Sorts articles by a valid column (e.g., title)", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toBeSortedBy("title", { descending: true });
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
          expect(msg).toBe("author not found");
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
    test("200: Returns empty array when topic is valid, but there are no existing articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toEqual([]);
        });
    });
    test("404: Returns error message when topic does not exist", () => {
      return request(app)
        .get("/api/articles?topic=nonexistentleagueoflegendstopic")
        .expect(404)
        .then(({ body }) => {
          const msg = body.msg;
          expect(msg).toBe("topic not found");
        });
    });
  });

  describe("GET /api/articles/:articleid", () => {
    test("200: Responds with article object relating to relevant article ID, including total number of comments", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(article.article_id).toBe(3);
          expect(article).toBeInstanceOf(Object);

          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.body).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
    });
    test("200: Responds with comment_count of 0, when article has no comments", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(article).toHaveProperty("comment_count", 0);
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
          expect(msg).toBe("bad request...");
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
          expect(typeof comment.created_at).toBe("string");
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
  test("404: Returns error message when article ID does not exist", () => {
    return request(app)
      .get("/api/articles/100000/comments")
      .expect(404)
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("article not found");
      });
  });
  test("400: Returns error message when article_id is of wrong data type", () => {
    return request(app)
      .get("/api/articles/invalidid/comments")
      .expect(400)
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("bad request...");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Returns posted comment on relevant article", () => {
    const input = {
      username: "butter_bridge",
      body: "yo this article was so well written!",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("article_id", 4);
        expect(comment).toHaveProperty("username", "butter_bridge");
        expect(comment).toHaveProperty(
          "body",
          "yo this article was so well written!"
        );
        expect(comment).toHaveProperty("votes", 0);
        expect(comment).toHaveProperty("created_at");
        expect(new Date(comment.created_at).toString()).not.toBe(
          "Invalid Date"
        );
      });
  });
  test("400: Returns error when comment provided is missing key(s)", () => {
    const input = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("comment could not be added as field(s) are missing");
      });
  });
  test("404: Returns error when article id does not exist", () => {
    const input = {
      username: "butter_bridge",
      body: "yo this article was so well written!",
    };
    return request(app)
      .post("/api/articles/-1/comments")
      .send(input)
      .expect(404)
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("article not found");
      });
  });
  test("400: Returns error when username does not exist - ensures only valid users can post comments", () => {
    const input = {
      username: "stepharina",
      body: "hello it's me, an unregistered user",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("username not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Updates number of votes on relevant article", () => {
    const input = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toHaveProperty("votes", 150);
        expect(article).toHaveProperty(
          "title",
          "Living in the shadow of a great man"
        );
        expect(article).toHaveProperty("topic", "mitch");
        expect(article).toHaveProperty("author", "butter_bridge");
        expect(article).toHaveProperty(
          "body",
          "I find this existence challenging"
        );
        expect(article).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(new Date(article.created_at).getTime()).not.toBe("Invalid Date");
      });
  });
  test("200: Updates number of votes on relevant article, including negative vote count", () => {
    const input = { inc_votes: -50 };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toHaveProperty("votes", 50);
        expect(article).toHaveProperty(
          "title",
          "Living in the shadow of a great man"
        );
        expect(article).toHaveProperty("topic", "mitch");
        expect(article).toHaveProperty("author", "butter_bridge");
        expect(article).toHaveProperty(
          "body",
          "I find this existence challenging"
        );
        expect(article).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(new Date(article.created_at).getTime()).not.toBe("Invalid Date");
      });
  });
  test("404: Returns error when article does not exist", () => {
    const input = { inc_votes: 20 };
    return request(app)
      .patch("/api/articles/-100")
      .send(input)
      .expect(404)
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("article not found");
      });
  });
  test("400: Returns error when request body does not contain inc_votes", () => {
    const input = {};
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("bad request...");
      });
  });
  test("400: Returns error if inc_votes is of wrong data type", () => {
    const input = { inc_votes: "hello this is a string" };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("inc_votes must be a number");
      });
  });
  test("400: Returns error if request body has additional/unwanted fields", () => {
    const input = { inc_votes: 1000, name: "Steph" };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("unexpected field in request body");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Deletes the given comment and responds with no content", () => {
    return request(app).delete("/api/comments/7").expect(204);
  });
  test("404: Returns error if comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/1000000")
      .expect(404)
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("comment id does not exist");
      });
  });
  test("400: Returns error if given invalid ID/data type", () => {
    return request(app)
      .delete("/api/comments/notAnID")
      .expect(400)
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("bad request...");
      });
  });
  test("404: Returns error if the comment has already been deleted", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return request(app)
          .delete("/api/comments/1")
          .expect(404)
          .then(({ body }) => {
            const msg = body.msg;
            expect(msg).toBe("comment id does not exist");
          });
      });
  });
});

describe("GET /api/users", () => {
  test("200: Returns array of objects of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;

        expect(users).toBeInstanceOf(Array);
        expect(users.length).toBeGreaterThan(0);

        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
  test("404: Returns error message when route is invalid", () => {
    return request(app)
      .get("/api/userssss")
      .expect(404)
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("path not found...");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: Returns an object of specified user", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body }) => {
        const user = body.user;
        expect(user).toBeInstanceOf(Object);

        expect(user).toHaveProperty("username", "rogersop");
        expect(user).toHaveProperty("name", "paul");
        expect(user).toHaveProperty(
          "avatar_url",
          "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4"
        );
      });
  });
  test("404: Returns error message when route is invalid", () => {
    return request(app)
      .get("/api/users/nonexistentusername")
      .expect(404)
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("username not found...");
      });
  });
});
