const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const {
  articleExists,
  commentExists,
  checkUserExists,
  topicExists,
  authorExists,
} = require("../models/utils.model.js");

beforeAll(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("Tests for utils.model.js", () => {
  describe("articleExists", () => {
    test("should return true if the article exists", () => {
      return articleExists(1).then((exists) => {
        expect(exists).toBe(true);
      });
    });
    test("should return false if the article does not exist", () => {
      return articleExists(9999).then((exists) => {
        expect(exists).toBe(false);
      });
    });
    test("should handle invalid article_id and reject the promise", () => {
      return articleExists("invalid_id").catch((err) => {
        expect(err).toBeDefined();
        expect(err).toHaveProperty("code", "22P02");
      });
    });
  });

  describe("checkUserExists", () => {
    test("should return true if the user exists", () => {
      return checkUserExists("butter_bridge").then((exists) => {
        expect(exists).toBe(true);
      });
    });

    test("should return false if the user does not exist", () => {
      return checkUserExists("non_existent_user").then((exists) => {
        expect(exists).toBe(false);
      });
    });

    test("should handle invalid username and resolve to false", () => {
      return checkUserExists(null).then((exists) => {
        expect(exists).toBe(false);
      });
    });
  });

  describe("commentExists", () => {
    test("should return true if the comment exists", () => {
      return commentExists(1).then((exists) => {
        expect(exists).toBe(true);
      });
    });

    test("should return false if the comment does not exist", () => {
      return commentExists(9999).then((exists) => {
        expect(exists).toBe(false);
      });
    });

    test("should handle invalid comment_id and reject the promise", () => {
      return commentExists("invalid_id").catch((err) => {
        expect(err).toBeDefined();
        expect(err.code).toBe("22P02");
      });
    });

    describe("topicExists", () => {
      test("should return true if the topic exists", () => {
        return topicExists("cats").then((exists) => {
          expect(exists).toBe(true);
        });
      });

      test("should return false if the topic does not exist", () => {
        return topicExists("non_existent_topic").then((exists) => {
          expect(exists).toBe(false);
        });
      });

      test("should handle invalid topic and resolve to false", () => {
        return topicExists(null).then((exists) => {
          expect(exists).toBe(false);
        });
      });
    });

    describe("authorExists", () => {
      test("should return true if the author exists", () => {
        return authorExists("butter_bridge").then((exists) => {
          expect(exists).toBe(true);
        });
      });

      test("should return false if the author does not exist", () => {
        return authorExists("non_existent_author").then((exists) => {
          expect(exists).toBe(false);
        });
      });

      test("should handle invalid author and resolve to false", () => {
        return authorExists(null).then((exists) => {
          expect(exists).toBe(false);
        });
      });
    });
  });
});
