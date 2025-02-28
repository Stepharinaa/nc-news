const { convertTimestampToDate, mapCommentsToArticleIds } = require("../db/seeds/utils");
const testData = require("../db/data/test-data/articles");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

describe.skip("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

beforeAll(async () => {
  await seed(testData); 
});

afterAll(async () => {
  await db.end();
});

describe("mapCommentsToArticleIDs", () => {
  test("returns an empty array when given an empty array", () => {
    expect(mapCommentsToArticleIds([], [])).toEqual([]);
  });

  test("correctly maps a single comment to the corresponding article_id", () => {
    const commentData = [
      {
        article_title: "Node.js Basics",
        body: "Great article!",
        votes: 5,
        author: "user1",
        created_at: 1600000000000,
      },
    ];

    const articleData = [
      { article_id: 1, title: "Node.js Basics" },
    ];

    expect(mapCommentsToArticleIds(commentData, articleData)).toEqual([
      {
        article_id: 1,
        body: "Great article!",
        votes: 5,
        author: "user1",
        created_at: 1600000000000,
      },
    ]);
  });

  test("correctly maps multiple comments to the correct article_ids", () => {
    const commentData = [
      { article_title: "Node.js Basics", body: "Nice!", votes: 2, author: "user1", created_at: 1610000000000 },
      { article_title: "JavaScript Async", body: "Helpful", votes: 4, author: "user2", created_at: 1620000000000 },
    ];

    const articleData = [
      { article_id: 1, title: "Node.js Basics" },
      { article_id: 2, title: "JavaScript Async" },
    ];

    expect(mapCommentsToArticleIds(commentData, articleData)).toEqual([
      { article_id: 1, body: "Nice!", votes: 2, author: "user1", created_at: 1610000000000 },
      { article_id: 2, body: "Helpful", votes: 4, author: "user2", created_at: 1620000000000 },
    ]);
  });

  test("ignores comments that do not match any article title", () => {
    const commentData = [
      { article_title: "Unknown Title", body: "Doesn't match", votes: 1, author: "user3", created_at: 1630000000000 },
    ];

    const articleData = [
      { article_id: 1, title: "Node.js Basics" },
    ];

    expect(mapCommentsToArticleIds(commentData, articleData)).toEqual([
      {
        article_id: undefined,
        body: "Doesn't match",
        votes: 1,
        author: "user3",
        created_at: 1630000000000,
      },
    ]);
  });

  test("maintains all properties except article_title", () => {
    const commentData = [
      {
        article_title: "Node.js Basics",
        body: "Awesome content!",
        votes: 3,
        author: "coder123",
        created_at: 1640000000000,
      },
    ];

    const articleData = [
      { article_id: 10, title: "Node.js Basics" },
    ];

    const result = mapCommentsToArticleIds(commentData, articleData);
    expect(result[0]).toHaveProperty("article_id", 10);
    expect(result[0]).toHaveProperty("body", "Awesome content!");
    expect(result[0]).toHaveProperty("votes", 3);
    expect(result[0]).toHaveProperty("author", "coder123");
    expect(result[0]).toHaveProperty("created_at", 1640000000000);
    expect(result[0]).not.toHaveProperty("article_title"); 
  });
});
