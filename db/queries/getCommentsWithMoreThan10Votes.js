const db = require('../connection');

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
getCommentsWithMoreThan10Votes()

module.exports = getCommentsWithMoreThan10Votes
