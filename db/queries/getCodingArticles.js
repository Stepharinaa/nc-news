const db = require('../connection');

const getCodingArticles = async () => {
    try {
        const { rows } = await db.query(
            "SELECT author, body FROM articles WHERE topic = 'coding'");
        console.log("Articles about coding:", rows);
        return rows;
    } catch (err) {
        console.log("Error fetching coding articles:", err);
    } finally {
        db.end()
    }
}

getCodingArticles()

module.exports = getCodingArticles