const db = require('../connection');

const getAllUsers = async () => {
    try {
      const { rows } = await db.query("SELECT * FROM users;");
      console.log("All Users:", rows);
      return rows;
    } catch (err) {
      console.log("Error fetching users:", err);
    } finally {
        db.end()
    }
  };

  getAllUsers()

  module.exports = getAllUsers