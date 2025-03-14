# Northcoders News API

## Project Summary

The Northcoders News API is a RESTful API that serves as the backend for a news application. It provides structured access to articles, users, comments, and topics, allowing clients to create, update, retrieve and delete data (CRUD).

This project was built using Node.js, Express.js, and PostgreSQL, following best practices for RESTful API design. It includes full database integration, testing with Jest, and deployment via Render.

## Live API

_Hosted API_: https://stephs-northcoders-news.onrender.com

## Instructions

### 1. Clone the Repository

Clone the NC News repository to your local machine:

```
git clone <https://github.com/your-username/nc-news.git>
```

Change directory into your newly cloned repo:

```
cd nc-news
```

### 2. Install Dependencies

Ensure you have [**Node.js**](https://nodejs.org/en) and [**PostgreSQL**](https://www.w3schools.com/postgresql/postgresql_install.php) installed before proceeding. Then, install the required dependencies using the following command:

```
npm install
```

### 3. Setting Up Environment Variables

> [!NOTE]
> _Under normal circumstances, I know `.env.` details wouldn't be shared, but for the sake of this project, I will be disclosing below:_

You will need to create two `.env` files to store database connection details:

`.env.development` file (for development database):

```
PGDATABASE=nc_news
```

`.env.test` file (for test database):

```
PGDATABASE=nc_news_test
```

> [!CAUTION]
> Ensure that your `.gitignore` file includes `.env.*` and `node_modules` to prevent these files from being pushed to GitHub.

### 4. Creating & Seeding the Databases

Once the `.env` files are created, create and seed the database using:

```
npm run setup-dbs      // Creates both test and development databases
npm run seed           // Seeds the development database
npm run test-seed      // Seeds the test database
```

### 5. Running the Test Suite

To verify that everything is working correctly, run:

```
npm test    // Runs Jest test suite
```

### 5. Running in Development Mode

For easier debugging, you can run the server using **nodemon**, which automatically restarts the server on file changes:

```
npm run dev
```

### 6. Running the API locally

To start the API server locally, use:

```
npm start
```

The server should now be running on: http://localhost:9090

## Minimum Requirements

- **Node.js** v18+
- **PostgreSQL** v14+
