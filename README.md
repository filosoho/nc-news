# Northcoders News API

Northcoders News API is a backend service built to provide data programmatically, mimicking a real-world application like Reddit. The API is designed to interact with a PostgreSQL database using node-postgres and allows for various operations related to articles, comments, users, and topics.

## Hosted Version

Access the hosted version of the NC-News API at: [NC-NEWS](https://nc-news-ivory.vercel.app/api)

[Go to Documentation](#api-documentation)

## Background

The purpose of this project is to create an API that can be accessed programmatically for managing and retrieving data related to news articles, users, comments, and topics. This project shows how to build and structure a backend service similar to those used in real-world applications.

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

```
Node.js (https://nodejs.org/) (version 14.17.0 or higher)
PostgreSQL (https://www.postgresql.org/) (version 12 or higher)
```

## Installing

To run the NC-News API server locally or deploy it to a production environment, follow the steps below.

### Clone the repository:

```
git clone https://github.com/filosoho/nc-news.git
```

```
cd your-repo-name
```

### Install the dependencies:

```
npm install
```

### Set up environment variables:

As .env.\* files are ignored by Git, you will need to create these files manually to set up the necessary environment variables for connecting to the databases.

### Create the following files in the root of the project

Ensure these `.env` files are listed in your `.gitignore` to prevent them from being pushed to GitHub.

```
.env.development
PGDATABASE=database_name

.env.test
PGDATABASE=database_name_test
```

### Run database setup and seed scripts:

```
npm run setup-dbs
npm run seed
```

## Running Tests

Run the automated tests with:

```
npm test
```

## API Documentation

Explore the full API documentation [here](https://nc-news-ivory.vercel.app/api) for detailed information on available endpoints, request methods, and examples.

Recommended extension to view JSON files [JSON Viewer Pro](https://chromewebstore.google.com/detail/json-viewer-pro/eifflpmocdbdmepbjaopkkhbfmdgijcc)

## API Endpoints

| Endpoint                                      | Description                                                           |
| --------------------------------------------- | --------------------------------------------------------------------- |
| GET /api                                      | Responds with a list of available endpoints                           |
| GET /api/topics                               | Responds with a list of topics                                        |
| POST /api/topics                              | Adds a new topic with a unique slug and description                   |
| GET /api/articles                             | Responds with a list of articles                                      |
| GET /api/articles (queries)                   | Allows articles to be filtered and sorted                             |
| POST /api/articles                            | Adds a new article                                                    |
| GET /api/articles/:article_id (comment count) | Adds a comment count to the response when retrieving a single article |
| GET /api/articles/:article_id                 | Responds with a single article retrived by article_id                 |
| PATCH /api/articles/:article_id               | Updates an article by article_id                                      |
| DELETE /api/articles/:article_id              | Deletes an article by article_id                                      |
| GET /api/articles/:article_id/comments        | Responds with a list of comments by article_id                        |
| POST /api/articles/:article_id/comments       | Adds a comment by article_id                                          |
| GET /api/comments/:comment_id                 | Responds with a single comment retirved by comment_id                 |
| PATCH /api/comments/:comment_id               | Updates a comment by comment_id                                       |
| DELETE /api/comments/:comment_id              | Deletes a comment by comment_id                                       |
| GET /api/users                                | Responds with a list of users                                         |
| GET /api/users/:username                      | Responds with a single object of a user retirved by a username        |

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create your feature branch (git checkout -b feature/AmazingFeature).
3. Commit your changes (git commit -m 'Add some AmazingFeature').
4. Push to the branch (git push origin feature/AmazingFeature).
5. Open a pull request.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
