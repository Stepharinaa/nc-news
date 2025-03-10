const db = require("../../db/connection");

const mapCommentsToArticleIds = (commentData, articleData) => {
  // console.log(commentData, "<--- commentdata");
  // console.log(articleData, "<-- articledata");
  const articleIdLookup = articleData.reduce((lookup, article) => {
    lookup[article.title] = article.article_id;
    return lookup;
  }, {});

  // console.log("Article ID Lookup:", articleIdLookup);

  return commentData.map(({ article_title, ...rest }) => {
    if (!articleIdLookup[article_title]) {
      console.error(`No article_id found for: ${article_title}`);
    }

    return {
      ...rest,
      article_id: articleIdLookup[article_title],
    };
  });
};

module.exports = { mapCommentsToArticleIds };
