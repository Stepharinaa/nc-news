const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data");

/* Set up your beforeEach & afterAll functions here  */
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
