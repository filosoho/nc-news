const db = require("../db/connection.js");
const { validateIncVotes } = require("../utils/utils.validation.js");
const {
  articleExists,
  topicExists,
  authorExists,
} = require("./utils.model.js");

exports.fetchArticles = (sort_by, order, topic, author, limit, page) => {
  const validSortColumns = [
    "article_id",
    "title",
    "author",
    "body",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];

  if (!sort_by) sort_by = "created_at";
  if (!order) order = "DESC";
  if (!limit || limit === "") limit = 10;
  if (!page || page === "") page = 1;

  const orderUpper = order.toUpperCase();
  const validOrder = ["ASC", "DESC"];

  if (!validSortColumns.includes(sort_by) || !validOrder.includes(orderUpper)) {
    return Promise.reject({
      status: 400,
      msg: "400 - Bad Request: Invalid sort_by or order query parameter",
    });
  }

  if (topic === "" || author === "") {
    return Promise.reject({
      status: 400,
      msg: "400 - Bad Request: Topic or Author value missing",
    });
  }

  const offset = (page - 1) * limit;

  let queryStr = `
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url,
    CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
  `;

  let countQueryStr = `
    SELECT COUNT(*)::int AS total_count
    FROM articles
  `;

  const queryParams = [];
  const countParams = [];

  if (topic) {
    queryStr += ` WHERE articles.topic = $${queryParams.length + 1}`;
    countQueryStr += ` WHERE articles.topic = $${countParams.length + 1}`;
    queryParams.push(topic);
    countParams.push(topic);
  }

  if (author) {
    if (queryParams.length > 0) {
      queryStr += ` AND articles.author = $${queryParams.length + 1}`;
      countQueryStr += ` AND articles.author = $${countParams.length + 1}`;
    } else {
      queryStr += ` WHERE articles.author = $${queryParams.length + 1}`;
      countQueryStr += ` WHERE articles.author = $${countParams.length + 1}`;
    }
    queryParams.push(author);
    countParams.push(author);
  }

  queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${orderUpper}
    LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2};
  `;

  queryParams.push(limit);
  queryParams.push(offset);

  const topicPromise = topic ? topicExists(topic) : Promise.resolve(true);
  const authorPromise = author ? authorExists(author) : Promise.resolve(true);

  return topicPromise
    .then((topicExists) => {
      if (!topicExists) {
        return Promise.reject({
          status: 404,
          msg: "404 - Not Found: Topic not found",
        });
      }
      return authorPromise;
    })
    .then((authorExists) => {
      if (!authorExists) {
        return Promise.reject({
          status: 404,
          msg: "404 - Not Found: Author not found",
        });
      }
      return db.query(queryStr, queryParams);
    })
    .then((articlesResult) => {
      return db.query(countQueryStr, countParams).then((countResult) => {
        const articles = articlesResult.rows;
        const total_count = countResult.rows[0].total_count;
        return { articles, total_count };
      });
    });
};

exports.fetchArticleById = (article_id) => {
  const articleId = Number(article_id);

  const queryStr = `
  SELECT articles.*, CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id;
`;

  return db.query(queryStr, [articleId]).then(({ rows }) => {
    const article = rows[0];
    if (!article) {
      return Promise.reject({
        status: 404,
        msg: "404 - Not Found: Article not found",
      });
    }
    return article;
  });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  return Promise.all([validateIncVotes(inc_votes)]).then(([validIncVotes]) => {
    return articleExists(article_id)
      .then((exists) => {
        if (!exists) {
          return Promise.reject({
            status: 404,
            msg: "404 - Not Found: Article not found",
          });
        }

        const queryStr = `
            UPDATE articles
            SET votes = votes + $1
            WHERE article_id = $2
            RETURNING *;
          `;

        return db.query(queryStr, [validIncVotes, article_id]);
      })
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "404 - Not Found: Article not found",
          });
        }
        return rows[0];
      });
  });
};

exports.addArticle = (newArticle) => {
  const {
    author,
    title,
    body,
    topic,
    article_img_url = "http://example.com/img.png",
    votes = 0,
    created_at = new Date().toISOString(),
  } = newArticle;

  const queryStr = `
    INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  return db
    .query(queryStr, [
      title,
      topic,
      author,
      body,
      created_at,
      votes,
      article_img_url,
    ])
    .then(({ rows }) => {
      const article = rows[0];
      return { ...article, comment_count: 0 };
    });
};

exports.removeArticleById = (article_id) => {
  return db
    .query("BEGIN")
    .then(() => {
      return db.query(
        `
        DELETE FROM comments
        WHERE article_id = $1;
      `,
        [article_id]
      );
    })
    .then(() => {
      return db.query(
        `
        DELETE FROM articles
        WHERE article_id = $1
        RETURNING *;
      `,
        [article_id]
      );
    })
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "404 - Not Found: Article not found",
        });
      }
      return db.query("COMMIT");
    })
    .catch((err) => {
      return db.query("ROLLBACK").then(() => {
        throw err;
      });
    });
};
