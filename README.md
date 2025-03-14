# Northcoders News API

## Project Summary

The Northcoders News API is a RESTful API that serves as the backend for a news application. It provides structured access to articles, users, comments, and topics, allowing clients to create, update, retrieve and delete data (CRUD).

This project was built using Node.js, Express.js, and PostgreSQL, following best practices for RESTful API design. It includes full database integration, testing with Jest, and deployment via Render.

## Live API

_Hosted API_: https://stephs-northcoders-news.onrender.com

## Instructions

### 1. Clone the Repository

Clone the NC News repo to your local machine:  
`git clone <https://github.com/Stepharinaa/nc-news>`

Remember to change directory into your chosen project folder:  
`cd <YOUR_PROJECT_FOLDER>`

### 2. Install Dependencies

Run the following command to install the required packages:  
`npm install`

### 3. Creating Databases

Run the setup script to create both the test and development databases:  
`npm run setup-dbs`

### 4. Setting Up Environment Variables

_Under normal circumstances, I know `.env.` details wouldn't be shared, but for the sake of this project, I will be disclosing below:_  
You will need to create two `.env` files to store database connection details:

`.env.development` file (for the development database):  
`PGDATABASE=nc_news`

`.env.test` file (for the test database):  
`PGDATABASE=nc_news_test`

Ensure that your `.gitignore` file includes `.env.*` and `node_modules` to prevent these files from being pushed to GitHub.

### 5. Seeding the Databases

To seed the test database and check the setup, run:

`npm run test-seed`

To seed the development database, run:

`npm run seed-dev`

### 6. Verifying the Setup

Run the test suite to check if your tables are set up correctly:

`npm run test-seed`

If all tests pass, your database is successfully seeded!
