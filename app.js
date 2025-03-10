const express = require("express");
const endpoints = require("./endpoints.json");
const db = require("./db/connection");
const { getTopics } = require("./controllers/controllers");

const app = express();

// Middleware I will use in future: app.use(express.json())

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpoints });
});

app.get("/api/topics", getTopics);

module.exports = app;
