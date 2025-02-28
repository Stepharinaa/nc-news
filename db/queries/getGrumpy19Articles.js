const db = require("../connection")

const getGrumpy19Articles = async () => {
    try {
        const { rows } = await db.query(
            "SELECT * FROM articles WHERE author = 'grumpy19';"
        )
        console.log("Articles written by grumpy19:", rows)
        return rows
    } catch (err) {
        console.log("Error fetching Grumpy19's articles:", err)
    } finally {
        db.end()
    }
}

getGrumpy19Articles()

module.exports = getGrumpy19Articles