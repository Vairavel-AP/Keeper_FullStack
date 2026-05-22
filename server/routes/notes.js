const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const verifyToken = require("../middleware/auth");

// All notes routes are protected
router.use(verifyToken);

// ─── GET all notes for logged-in user ────────────────────────
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get notes error:", err.message);
    res.status(500).json({ error: "Failed to fetch notes." });
  }
});

// ─── POST create a new note ───────────────────────────────────
router.post("/", async (req, res) => {
  const { title, content } = req.body;

  if (!content || content.trim() === "")
    return res.status(400).json({ error: "Note content is required." });

  try {
    const result = await pool.query(
      "INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
      [req.user.id, title || "", content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create note error:", err.message);
    res.status(500).json({ error: "Failed to create note." });
  }
});

// ─── PUT update a note ────────────────────────────────────────
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const result = await pool.query(
      `UPDATE notes
       SET title = $1, content = $2, updated_at = NOW()
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [title || "", content, id, req.user.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Note not found." });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update note error:", err.message);
    res.status(500).json({ error: "Failed to update note." });
  }
});

// ─── DELETE a note ────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, req.user.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Note not found." });

    res.json({ message: "Note deleted successfully.", id });
  } catch (err) {
    console.error("Delete note error:", err.message);
    res.status(500).json({ error: "Failed to delete note." });
  }
});

module.exports = router;
