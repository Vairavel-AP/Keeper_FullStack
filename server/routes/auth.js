const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { pool } = require("../db");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const SALT_ROUNDS = 10;

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ─── Register ────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required." });

  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters." });

  try {
    // Check if email already exists
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0)
      return res.status(409).json({ error: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ error: "Server error during registration." });
  }
});

// ─── Login ───────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user)
      return res.status(401).json({ error: "Invalid email or password." });

    if (!user.password)
      return res.status(401).json({ error: "This account uses Google Sign-In." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password." });

    const token = generateToken(user);

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error during login." });
  }
});

// ─── Google Sign-In ──────────────────────────────────────────
router.post("/google", async (req, res) => {
  const { credential } = req.body;

  if (!credential)
    return res.status(400).json({ error: "Google credential is required." });

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    let result = await pool.query("SELECT * FROM users WHERE google_id = $1 OR email = $2", [googleId, email]);
    let user = result.rows[0];

    if (!user) {
      // Create new Google user
      const inserted = await pool.query(
        "INSERT INTO users (name, email, google_id, avatar) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, email, googleId, picture]
      );
      user = inserted.rows[0];
    } else if (!user.google_id) {
      // Link Google ID to existing email account
      await pool.query("UPDATE users SET google_id = $1, avatar = $2 WHERE id = $3", [googleId, picture, user.id]);
    }

    const token = generateToken(user);

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar || picture } });
  } catch (err) {
    console.error("Google auth error:", err.message);
    res.status(500).json({ error: "Google authentication failed." });
  }
});

// ─── Get current user ────────────────────────────────────────
const verifyToken = require("../middleware/auth");

router.get("/me", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, avatar, created_at FROM users WHERE id = $1",
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
