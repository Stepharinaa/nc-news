const { Pool } = require("pg");
require("dotenv").config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV || "development"}`,
});

const ENV = process.env.NODE_ENV || "development";

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL must be set");
}

const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 2,
      }
    : {};

const db = new Pool(config);

module.exports = db;
