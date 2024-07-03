// Import packages
const bcrypt = require("bcryptjs");
const _ = require("lodash");

// Import config
const { database } = require("../config");

// Helper: Does email exist
async function doesEmailExist(email) {
  try {
    const user = await getUserByEmail(email);
    if (user) return true;
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}

// Service: Get user by email
async function getUserByEmail(email) {
  try {
    const response = await database.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    let user = false;
    if (response.length && !_.isEmpty(response[0])) {
      [[user]] = response;
    }
    return user;
  } catch (err) {
    console.error(err);
    return false;
  }
}

// Service: Create user
async function createUser(payload) {
  try {
    const { firstname, lastname, email, password } = payload;
    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await database.query(
      `INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)`,
      [firstname, lastname, email, hashedPassword]
    );

    const [{ insertId: userID }] = response;

    const user = {
      id: userID,
      ...payload,
    };
    delete user.password;
    return user;
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = {
  doesEmailExist,
  getUserByEmail,
  createUser,
};
