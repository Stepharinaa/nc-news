const endpointsJson = require("../endpoints.json");

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

describe("POST /api/topics", () => {
  test("201: Responds with topic object containing newly added topic", () => {
    const input = {
      slug: "Studio Ghibli",
      description: "All things Ghibli related!",
    };
    return request(app)
      .post("/api/topics")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        const topic = body.topic;
        expect(topic).toHaveProperty("slug", "Studio Ghibli");
        expect(topic).toHaveProperty(
          "description",
          "All things Ghibli related!"
        );
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            const topics = body.topics;
            const addedTopic = topics.find(
              (topic) => topic.slug === "Studio Ghibli"
            );
            expect(addedTopic).toHaveProperty("slug", "Studio Ghibli");
            expect(addedTopic).toHaveProperty(
              "description",
              "All things Ghibli related!"
            );
          });
      });
  });
  test("400: Responds with error message if slug and/or description is not provided", () => {
    const input = {};
    return request(app)
      .post("/api/topics")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("Bad Request: Missing required fields...");
      });
  });
  test("409: Responds with error if slug already exists", () => {
    const input = {
      slug: "Dead by Daylight Tips",
      description:
        "Wanna GIT GUD and become a DbD Pro? You're in the right place",
    };
    return request(app)
      .post("/api/topics")
      .send(input)
      .expect(201)
      .then(() => {
        return request(app)
          .post("/api/topics")
          .send(input)
          .expect(409)
          .then(({ body }) => {
            expect(body.msg).toBe(
              "Conflict: Value already exists/cannot insert duplicate value"
            );
          });
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
        expect(articles.length).toBeGreaterThan(0);

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

  describe("POST /api/articles", () => {
    test("201: Returns newly posted article object, even if article_img_url is not provided", () => {
      const input = {
        author: "lurker",
        title: "Why Mitch Shouldn't Play League of Legends",
        body: "Everyone on League is a massive INTer.",
        topic: "mitch",
      };
      return request(app)
        .post("/api/articles")
        .send(input)
        .expect(201)
        .then(({ body }) => {
          const article = body.article;
          expect(article).toMatchObject({
            author: "lurker",
            title: "Why Mitch Shouldn't Play League of Legends",
            body: "Everyone on League is a massive INTer.",
            topic: "mitch",
            article_img_url: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
    });
    test("201: Ignores unnecessary properties and successfully creates an article", () => {
      const input = {
        author: "lurker",
        title: "Really Interesting Article",
        body: "This Is How Our Brains Function When We Sleep Cuddling a Cat...",
        topic: "cats",
        extra_property: "This should be ignored",
      };

      return request(app)
        .post("/api/articles")
        .send(input)
        .expect(201)
        .then(({ body }) => {
          const article = body.article;
          expect(article).toMatchObject({
            author: "lurker",
            title: "Really Interesting Article",
            body: "This Is How Our Brains Function When We Sleep Cuddling a Cat...",
            topic: "cats",
            article_img_url: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(article).not.toHaveProperty("extra_property");
        });
    });
    test("400: Responds with an error when required fields are missing", () => {
      const input = {
        author: "lurker",
        title: "Which Coding Language is the Best to Learn for Beginners?",
      };

      return request(app)
        .post("/api/articles")
        .send(input)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request: Missing required fields...");
        });
    });
    test("400: Responds with an error when author does not exist", () => {
      const input = {
        author: "non_existent_user",
        title: "Random Article",
        body: "Are Dogs Truly Better Than Cats?",
        topic: "cats",
      };

      return request(app)
        .post("/api/articles")
        .send(input)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found: Author does not exist");
        });
    });
    test("400: Responds with an error when given invalid data types", () => {
      const input = {
        author: "lurker",
        title: 12345,
        body: "Introduction to How to Lurk on Twitch :)",
        topic: "mitch",
        article_img_url: 67890,
      };

      return request(app)
        .post("/api/articles")
        .send(input)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid data type");
        });
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
          expect(msg).toBe("invalid query parameters");
        });
    });
    test("400: Returns error message when given invalid order query", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=RANDOMGIVENORDER")
        .expect(400)
        .then(({ body }) => {
          const msg = body.msg;
          expect(msg).toBe("invalid query parameters");
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
          expect(articles).toBeInstanceOf(Array);
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

  describe("GET /api/articles with pagination", () => {
    test("200: Returns paginated articles with a total_count", () => {
      return request(app)
        .get("/api/articles?limit=6&page=1")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveLength(6);
          expect(body).toHaveProperty("total_count");
          expect(body.total_count).toEqual(expect.any(Number));

          body.articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
              article_img_url: expect.any(String),
            });
          });
        });
    });
    test("200: Returns distinct/unique articles for different pages", () => {
      return Promise.all([
        request(app).get("/api/articles?limit=5&page=1").expect(200),
        request(app).get("/api/articles?limit=5&page=2").expect(200),
      ]).then(([responsePage1, responsePage2]) => {
        const articlesPage1 = responsePage1.body.articles;
        const articlesPage2 = responsePage2.body.articles;

        expect(articlesPage1.length).toBeLessThanOrEqual(5);
        expect(articlesPage2.length).toBeLessThanOrEqual(5);

        expect(responsePage1.body.total_count).toBe(
          responsePage2.body.total_count
        );

        const articleIDsPage1 = articlesPage1.map(
          (article) => article.article_id
        );
        const articleIDsPage2 = articlesPage2.map(
          (article) => article.article_id
        );

        expect(articleIDsPage1).not.toEqual(
          expect.arrayContaining(articleIDsPage2)
        );
      });
    });
    test("200: Returns empty articles array when requesting a page beyond the last page", () => {
      return request(app)
        .get("/api/articles?limit=5&page=1")
        .expect(200)
        .then(({ body }) => {
          const totalArticles = body.total_count;
          const limit = 5;
          const lastPage = Math.ceil(totalArticles / limit);
          const beyondLastPage = lastPage + 1;

          return request(app)
            .get(`/api/articles?limit=${limit}&page=${beyondLastPage}`)
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toEqual([]);
              expect(body.total_count).toBe(totalArticles);
            });
        });
    });
    test("200: Returns only the available articles when limit exceeds total articles", () => {
      return request(app)
        .get("/api/articles?limit=1000&page=1")
        .expect(200)
        .then(({ body }) => {
          const totalArticles = body.total_count;

          expect(body.articles.length).toBeLessThanOrEqual(totalArticles);

          body.articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
              article_img_url: expect.any(String),
            });
          });
        });
    });
    test("400: Returns error message if page number provided is invalid", () => {
      return request(app)
        .get("/api/articles?limit=5&page=0")
        .expect(400)
        .then(({ body }) => {
          const msg = body.msg;
          expect(msg).toBe("Invalid page provided");
        });
    });
    test("400: Returns error message if page number provided is of wrong data type", () => {
      return request(app)
        .get("/api/articles?limit=5&page=thisIsNotANumber")
        .expect(400)
        .then(({ body }) => {
          const msg = body.msg;
          expect(msg).toBe("Invalid data type");
        });
    });
    test("400: Returns error message if limit provided is of wrong data type", () => {
      return request(app)
        .get("/api/articles?limit=thisIsNotANumber&page=1")
        .expect(400)
        .then(({ body }) => {
          const msg = body.msg;
          expect(msg).toBe("Invalid data type");
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
          expect(msg).toBe("Invalid data type");
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
        expect(msg).toBe("Invalid data type");
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
        expect(msg).toBe("Bad Request: Missing required fields...");
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

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Updates votes on a comment on relevant comment id", () => {
    const input = { inc_votes: 25 };
    return request(app)
      .patch("/api/comments/1")
      .send(input)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toHaveProperty("comment_id", 1);
        expect(comment).toHaveProperty("article_id", 9);
        expect(comment).toHaveProperty("author", "butter_bridge");
        expect(comment).toHaveProperty(
          "body",
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
        );
        expect(comment).toHaveProperty("votes", 41);
        expect(new Date(comment.created_at).toString()).not.toBe(
          "Invalid Date"
        );
      });
  });
  test("200: Updates votes on comment, including negative votes", () => {
    const input = { inc_votes: -20 };
    return request(app)
      .patch("/api/comments/2")
      .send(input)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toHaveProperty("comment_id", 2);
        expect(comment).toHaveProperty("article_id", 1);
        expect(comment).toHaveProperty("author", "butter_bridge");
        expect(comment).toHaveProperty(
          "body",
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
        );
        expect(comment).toHaveProperty("votes", -6);
        expect(new Date(comment.created_at).toString()).not.toBe(
          "Invalid Date"
        );
      });
  });
  test("404: Returns error when comment doesn't exist", () => {
    const input = { inc_votes: -20 };
    return request(app)
      .patch("/api/comments/-1000")
      .send(input)
      .then(({ body }) => {
        expect(body.msg).toBe("comment does not exist");
      });
  });
  test("400: Returns error if 'inc_votes' is missing", () => {
    return request(app)
      .patch("/api/comments/2")
      .then(({ body }) => {
        expect(body.msg).toBe("bad request: missing 'inc_votes'");
      });
  });
  test("400: Returns error if `inc_votes` is not a number", () => {
    const input = { inc_votes: "not-a-number" };
    return request(app)
      .patch("/api/comments/1")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data type");
      });
  });
  test("404: Returns error when comment does not exist", () => {
    const input = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/999999")
      .send(input)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment does not exist");
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
        expect(msg).toBe("Invalid data type");
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
