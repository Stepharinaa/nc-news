# NC News

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
*Under normal circumstances, I know `.env.` details wouldn't be shared, but for the sake of this project, I will be disclosing below:*  
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
