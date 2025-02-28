const db = require('../connection');

const getCommentsWithNegativeVotes = async () => {
    try {
        const { rows } = await db.query(
            "SELECT body FROM comments WHERE votes < 0");
        console.log("Comments with votes below zero:", rows);
        return rows;
    } catch (err) {
        console.log("Error fetching comments with votes below zero:", err)
    } finally {
        db.end()
    }
}

getCommentsWithNegativeVotes()

module.exports = getCommentsWithNegativeVotes