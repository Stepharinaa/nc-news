const db = require('../connection');

const getAllUsers = async () => {
    try {
      const { rows } = await db.query("SELECT * FROM users;");
      console.log("All Users:", rows);
      return rows;
    } catch (err) {
      console.log("Error fetching users:", err);
    }
  };

const getCodingArticles = async () => {
    try {
        const { rows } = await db.query(
            "SELECT author, body FROM articles WHERE topic = 'coding'");
        console.log("Articles about coding:", rows);
        return rows;
    } catch (err) {
        console.log("Error fetching coding articles:", err);
    }
}

const getCommentsWithNegativeVotes = async () => {
    try {
        const { rows } = await db.query(
            "SELECT body FROM comments WHERE votes < 0");
        console.log("Comments with votes below zero:", rows);
        return rows;
    } catch (err) {
        console.log("Error fetching comments with votes below zero:", err)
    }
}

const getAllTopics = async () => {
    try {
        const { rows } = await db.query(
            "SELECT * FROM topics");
        console.log("All topics:", rows);
        return rows;
    } catch (err) {
        console.log("Error fetching all topics:", err)
    }
}

const getGrumpy19Articles = async () => {
    try {
        const { rows } = await db.query(
            "SELECT * FROM articles WHERE author = 'grumpy19';"
        )
        console.log("Articles written by grumpy19:", rows)
        return rows
    } catch (err) {
        console.log("Error fetching Grumpy19's articles:", err)
    }
}

const getCommentsWithMoreThan10Votes = async () => {
    try {
        const { rows } = await db.query(
            "SELECT * FROM comments WHERE votes > 10;"
        )
        console.log("Comments with more than 10 votes:", rows)
        return rows
    } catch (err) { 
        console.log("Error fetching comments with more than 10 votes")
    }
}

if (require.main === module) {
    (async () => {
      await getAllUsers();
      await getCodingArticles();
      await getCommentsWithNegativeVotes();
      await getAllTopics();
      await getGrumpy19Articles();
      await getCommentsWithMoreThan10Votes();
      db.end(); 
    })();
  }


/* module.exports = { getAllUsers,
    getCommentsWithNegativeVotes,
    getCodingArticles,
    getAllTopics,
    getGrumpy19Articles,
    getCommentsWithMoreThan10Votes } */