const db = require("../../db/connection");
const format = require("pg-format")

/*exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
}; 
^ this is no longer needed due to the new Date constructor we've used in seed.js
*/ 

const mapCommentsToArticleIds = (commentData, articleData) => {
  const articleIdLookup = articleData.reduce((lookup, article) => {
    lookup[article.title] = article.article_id; 
    return lookup;
  }, {});

  console.log("Article ID Lookup:", articleIdLookup); 

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