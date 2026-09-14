const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET /api/messages
// Returns all conversations for the logged-in buyer, each with its full
// message history, unread count, and the order it relates to (if any).
router.get("/", async (req, res) => {
  try {
    const [conversations] = await pool.query(
      `SELECT c.conversation_id AS conversationId, s.company_name AS supplierName,
              c.related_order_id AS relatedOrderId
       FROM conversations c
       JOIN suppliers s ON s.supplier_id = c.supplier_id
       WHERE c.user_id = ?
       ORDER BY c.created_at DESC`,
      [req.user.userId]
    );

    for (const convo of conversations) {
      const [messages] = await pool.query(
        `SELECT message_id AS messageId, sender_type AS senderType,
                message_text AS text, is_read AS isRead, created_at AS time
         FROM messages
         WHERE conversation_id = ?
         ORDER BY created_at ASC`,
        [convo.conversationId]
      );
      convo.messages = messages;
      convo.unreadCount = messages.filter((m) => !m.isRead && m.senderType === "supplier").length;
      const last = messages[messages.length - 1];
      convo.lastMessage = last ? last.text : "";
      convo.lastMessageTime = last ? last.time : null;
    }

    res.json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch messages" });
  }
});

// POST /api/messages
// Body: { conversationId, text }
router.post("/", async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    if (!conversationId || !text || !text.trim()) {
      return res.status(400).json({ error: "conversationId and text are required" });
    }

    // Confirm this conversation actually belongs to the logged-in buyer
    const [[convo]] = await pool.query(
      "SELECT conversation_id FROM conversations WHERE conversation_id = ? AND user_id = ?",
      [conversationId, req.user.userId]
    );
    if (!convo) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const [result] = await pool.query(
      "INSERT INTO messages (conversation_id, sender_type, message_text, is_read) VALUES (?, 'buyer', ?, TRUE)",
      [conversationId, text]
    );

    res.status(201).json({ messageId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not send message" });
  }
});

// PUT /api/messages/:conversationId/read
// Marks every supplier message in this conversation as read.
router.put("/:conversationId/read", async (req, res) => {
  try {
    await pool.query(
      `UPDATE messages m
       JOIN conversations c ON c.conversation_id = m.conversation_id
       SET m.is_read = TRUE
       WHERE m.conversation_id = ? AND c.user_id = ? AND m.sender_type = 'supplier'`,
      [req.params.conversationId, req.user.userId]
    );
    res.json({ message: "Marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update conversation" });
  }
});

module.exports = router;
