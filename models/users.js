const { pool } = require("../db/pool");

async function findUserByEmailOrUsername(identifier) {
    const { rows } = await pool.query(
        `SELECT id, email, username, password_hash, created_at
     FROM users
     WHERE email = $1 OR username = $1`,
        [identifier]
    );
    return rows[0] || null;
}

async function findUserByEmail(email){
    const {rows} = await pool.query(
         `SELECT id, email, password_hash, created_at
     FROM users
     WHERE email = $1`,[email]
    );
    return rows[0] || null;
}

async function findUserByUsername(username){
    const {rows} = await pool.query(
         `SELECT id, username, password_hash, created_at
     FROM users
     WHERE username = $1`,[username]
    );
    return rows[0] || null;
}

async function createUser(email, username, passwordHash) {
    const { rows } = await pool.query(
        `INSERT INTO users (email, username, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, email, username, created_at`,
        [email, username, passwordHash]
    );
    return rows[0];
}

module.exports = {findUserByEmail, findUserByUsername, findUserByEmailOrUsername, createUser };