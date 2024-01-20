# Northcoders News API 

## Summary
The aim of this project was to mimic the backend service of an online news provider. The app serves news articles and user comments to the client.

**[Here's a link to the hosted application!](https://news-api-ndji.onrender.com/api)**

## How to Clone
Clone the repository using `git clone https://github.com/harrycs1/news-api`. The MVC framework has been used. Controllers and models are found in their respective folders.

## How to Run 
#### Create `.env` files
To run the repository locally, create two `.env` files: `.env.test` and `.env.development`. Add `PGDATABASE=nc_news_test` or `PGDATABASE=nc_news` to each file.
#### Setup databases
A script has been written in `package.json` that will set up both the development and test databases, provided the `.env` files have been created correctly. To execute the script, use the `setup-dbs` command.
#### Seed development database
To seed the development database with preliminary data, a script has been written in `package.json`. To execute the script, use the `seed` command.

## How to Test
A test script has been setup in `package.json` that will seed the test data and run the test files. To execute the script, use the `npm test` command. Tests for the app and utility functions are found in the `__tests__` folder.

## Requirements and Dependencies
Node postgres (v21.1.0) is used to interact with a PSQL (v16.0) database.

**Running the `npm install` command from inside the app directory will install the following dependencies:**
- dotenv ^16.0.0 
- express ^4.18.2 
- pg ^8.7.3 
- supertest
- jest
