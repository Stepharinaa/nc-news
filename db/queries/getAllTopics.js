const db = require('../connection');

const getAllTopics = async () => {
    try {
        const { rows } = await db.query(
            "SELECT * FROM topics");
        console.log("All topics:", rows);
        return rows;
    } catch (err) {
        console.log("Error fetching all topics:", err)
    } finally {
        db.end()
}
}

getAllTopics()

module.exports = getAllTopics