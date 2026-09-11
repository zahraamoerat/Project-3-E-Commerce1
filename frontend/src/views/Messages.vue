<template>
  <div class="main-content messages-layout">
    <!-- Conversation list -->
    <aside class="conversation-list card">
      <div class="list-header">
        <h3>Messages</h3>
        <input v-model="searchQuery" type="text" placeholder="Search conversations..." class="search-input" />
      </div>
      <ul>
        <li
          v-for="c in filteredConversations"
          :key="c.conversationId"
          :class="{ active: c.conversationId === activeConversationId }"
          @click="selectConversation(c)"
        >
          <div class="avatar">{{ initials(c.supplierName) }}</div>
          <div class="conversation-info">
            <div class="conversation-top">
              <strong>{{ c.supplierName }}</strong>
              <span class="time">{{ c.lastMessageTime }}</span>
            </div>
            <p class="preview">{{ c.lastMessage }}</p>
          </div>
          <span v-if="c.unreadCount > 0" class="unread-badge">{{ c.unreadCount }}</span>
        </li>
      </ul>
    </aside>

    <!-- Active thread -->
    <section class="thread card">
      <div class="thread-header">
        <div class="avatar">{{ initials(activeConversation.supplierName) }}</div>
        <div>
          <strong>{{ activeConversation.supplierName }}</strong>
          <p class="thread-subtitle">Re: Order #{{ activeConversation.relatedOrderId }}</p>
        </div>
      </div>

      <div class="thread-messages">
        <div
          v-for="m in activeConversation.messages"
          :key="m.messageId"
          class="message-bubble"
          :class="{ mine: m.fromMe }"
        >
          <p>{{ m.text }}</p>
          <span class="message-time">{{ m.time }}</span>
        </div>
      </div>

      <form class="thread-input" @submit.prevent="sendMessage">
        <input v-model="newMessage" type="text" placeholder="Type a message..." />
        <button class="btn-primary" type="submit" :disabled="!newMessage.trim()">Send</button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../services/api";

const searchQuery = ref("");
const newMessage = ref("");

// Populated from GET /api/messages once the backend route exists.
// Sample data below so the page is viewable while you build.
const conversations = ref([
  {
    conversationId: 1,
    supplierName: "Highveld Seed Co.",
    relatedOrderId: "1042",
    lastMessage: "Your maize seed order has been dispatched.",
    lastMessageTime: "10:24",
    unreadCount: 2,
    messages: [
      { messageId: 1, fromMe: true, text: "Hi, could you confirm stock on the 10kg maize seed bags?", time: "09:50" },
      { messageId: 2, fromMe: false, text: "Yes, we have 40 bags in stock at our Bethlehem depot.", time: "10:02" },
      { messageId: 3, fromMe: false, text: "Your maize seed order has been dispatched.", time: "10:24" },
    ],
  },
  {
    conversationId: 2,
    supplierName: "Karoo Fertiliser Traders",
    relatedOrderId: "1035",
    lastMessage: "Invoice attached for your NPK order.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    messages: [
      { messageId: 1, fromMe: true, text: "Can I get a quote for 20 bags of NPK 2:3:2?", time: "Yesterday, 14:10" },
      { messageId: 2, fromMe: false, text: "Invoice attached for your NPK order.", time: "Yesterday, 15:02" },
    ],
  },
  {
    conversationId: 3,
    supplierName: "FarmTech Equipment Parts",
    relatedOrderId: "1038",
    lastMessage: "Thanks for the order, let us know if the parts fit.",
    lastMessageTime: "Mon",
    unreadCount: 0,
    messages: [
      { messageId: 1, fromMe: false, text: "Thanks for the order, let us know if the parts fit.", time: "Mon, 11:00" },
    ],
  },
]);

const activeConversationId = ref(1);

const activeConversation = computed(
  () => conversations.value.find((c) => c.conversationId === activeConversationId.value) || conversations.value[0]
);

const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value;
  return conversations.value.filter((c) =>
    c.supplierName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

function initials(name) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function selectConversation(conversation) {
  activeConversationId.value = conversation.conversationId;
  // Once the backend route exists, also call something like:
  // await api.put(`/messages/${conversation.conversationId}/read`);
  conversation.unreadCount = 0;
}

function sendMessage() {
  if (!newMessage.value.trim()) return;
  // Once the backend route exists, POST the message instead of pushing locally:
  // await api.post("/messages", { conversationId: activeConversationId.value, text: newMessage.value });
  activeConversation.value.messages.push({
    messageId: activeConversation.value.messages.length + 1,
    fromMe: true,
    text: newMessage.value,
    time: "Just now",
  });
  activeConversation.value.lastMessage = newMessage.value;
  activeConversation.value.lastMessageTime = "Just now";
  newMessage.value = "";
}

async function loadConversations() {
  // Once the backend route exists, replace the ref() sample data above with:
  // const { data } = await api.get("/messages");
  // conversations.value = data;
}

onMounted(loadConversations);
</script>

<style scoped>
.messages-layout {
  display: flex;
  gap: 16px;
  height: calc(100vh - 56px);
}

.conversation-list {
  width: 280px;
  flex-shrink: 0;
  padding: 0;
  overflow-y: auto;
}
.list-header {
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
}
.list-header h3 { margin-bottom: 10px; }
.search-input { font-size: 13px; }

.conversation-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.conversation-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
}
.conversation-list li:hover { background: var(--color-bg); }
.conversation-list li.active { background: var(--color-accent-soft); }

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-weight: 700;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}
.conversation-top {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}
.time { color: var(--color-text-muted); font-size: 11px; }
.preview {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.unread-badge {
  background: var(--color-accent);
  color: white;
  font-size: 11px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}

.thread {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}
.thread-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
}
.thread-subtitle {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--color-text-muted);
}

.thread-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.message-bubble {
  max-width: 65%;
  background: var(--color-bg);
  border-radius: var(--radius);
  padding: 10px 14px;
  align-self: flex-start;
}
.message-bubble.mine {
  background: var(--color-accent-soft);
  align-self: flex-end;
}
.message-bubble p { margin: 0; font-size: 14px; }
.message-time {
  display: block;
  font-size: 10px;
  color: var(--color-text-muted);
  margin-top: 4px;
}

.thread-input {
  display: flex;
  gap: 10px;
  padding: 16px;
  border-top: 1px solid var(--color-border);
}
.thread-input input { flex: 1; }
</style>