const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  findUserByEmail,
  findUserByUsername,
  findUserByEmailOrUsername,
  createUser,
} = require("../models/user.model");

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
}

function safeUser(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    created_at: user.created_at,
  };
}

async function register({ email, username, password }) {
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedUsername = username.trim();

  const existingEmail = await findUserByEmail(normalizedEmail);
  if (existingEmail) {
    const err = new Error("Email already in use");
    err.status = 409;
    throw err;
  }

  const existingUsername = await findUserByUsername(normalizedUsername);
  if (existingUsername) {
    const err = new Error("Username already in use");
    err.status = 409;
    throw err;
  }

  const rounds = Number(process.env.BCRYPT_ROUNDS || 12);
  const passwordHash = await bcrypt.hash(password, rounds);

  const user = await createUser(normalizedEmail, normalizedUsername, passwordHash);

  const token = signToken(user);
  return { user: safeUser(user), token };
}

async function login({ identifier, password }) {
  const normalizedIdentifier = identifier.trim();

  const user = await findUserByEmailOrUsername(normalizedIdentifier);
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const token = signToken(user);
  return { user: safeUser(user), token };
}

module.exports = { register, login };
