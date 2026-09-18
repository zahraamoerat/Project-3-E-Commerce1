const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

async function getBuyerId(userId) {
  const [[buyer]] = await pool.query(
    "SELECT buyer_id AS buyerId FROM buyers WHERE user_id = ?",
    [userId]
  );
  return buyer ? buyer.buyerId : null;
}

// mysql2 returns DATETIME columns as JS Date objects, which would otherwise
// serialize to a raw ISO string ("2026-09-18T09:02:24.000Z") in the JSON
// response — not what the chat-bubble/list UI wants to display. Formats to
// "14:32" for today, "Yesterday", a short weekday for the last week, or a
// short date further back.
function formatDisplayTime(dateVal) {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  const now = new Date();

  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", hour12: false });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays < 7) return d.toLocaleDateString("en-ZA", { weekday: "short" });

  return d.toLocaleDateString("en-ZA", { day: "2-digit", month: "short" });
}

// GET /api/messages
// Returns all conversations for the logged-in buyer, each with its full
// message history and unread count.
//
// NOTE: conversations has no order-link column — a conversation is scoped
// to a buyer/supplier pair, not a specific order. So there's no "Re: Order
// #X" data to send here; the frontend line for it was removed rather than
// guessed at.
router.get("/", async (req, res) => {
  try {
    const buyerId = await getBuyerId(req.user.userId);
    if (!buyerId) {
      return res.status(404).json({ error: "No buyer profile found for this account" });
    }

    const [conversations] = await pool.query(
      `SELECT c.conversation_id AS conversationId, s.business_name AS supplierName
       FROM conversations c
       JOIN suppliers s ON s.supplier_id = c.supplier_id
       WHERE c.buyer_id = ?
       ORDER BY c.last_message_at DESC`,
      [buyerId]
    );

    for (const convo of conversations) {
      const [messages] = await pool.query(
        `SELECT message_id AS messageId, sender_id AS senderId,
                message_text AS text, is_read AS isRead, sent_at AS time
         FROM messages
         WHERE conversation_id = ?
         ORDER BY sent_at ASC`,
        [convo.conversationId]
      );

      convo.messages = messages.map((m) => ({
        messageId: m.messageId,
        fromMe: m.senderId === req.user.userId,
        text: m.text,
        time: formatDisplayTime(m.time),
      }));
      convo.unreadCount = messages.filter((m) => !m.isRead && m.senderId !== req.user.userId).length;

      const last = messages[messages.length - 1];
      convo.lastMessage = last ? last.text : "";
      convo.lastMessageTime = last ? formatDisplayTime(last.time) : null;
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

    const buyerId = await getBuyerId(req.user.userId);
    if (!buyerId) {
      return res.status(404).json({ error: "No buyer profile found for this account" });
    }

    // Confirm this conversation actually belongs to the logged-in buyer
    const [[convo]] = await pool.query(
      "SELECT conversation_id FROM conversations WHERE conversation_id = ? AND buyer_id = ?",
      [conversationId, buyerId]
    );
    if (!convo) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const [result] = await pool.query(
      "INSERT INTO messages (conversation_id, sender_id, message_text, is_read) VALUES (?, ?, ?, TRUE)",
      [conversationId, req.user.userId, text]
    );

    await pool.query(
      "UPDATE conversations SET last_message_at = NOW() WHERE conversation_id = ?",
      [conversationId]
    );

    res.status(201).json({ messageId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not send message" });
  }
});

// PUT /api/messages/:conversationId/read
// Marks every message NOT sent by the logged-in buyer as read.
router.put("/:conversationId/read", async (req, res) => {
  try {
    const buyerId = await getBuyerId(req.user.userId);
    if (!buyerId) {
      return res.status(404).json({ error: "No buyer profile found for this account" });
    }

    await pool.query(
      `UPDATE messages m
       JOIN conversations c ON c.conversation_id = m.conversation_id
       SET m.is_read = TRUE
       WHERE m.conversation_id = ? AND c.buyer_id = ? AND m.sender_id != ?`,
      [req.params.conversationId, buyerId, req.user.userId]
    );
    res.json({ message: "Marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update conversation" });
  }
});

module.exports = router;