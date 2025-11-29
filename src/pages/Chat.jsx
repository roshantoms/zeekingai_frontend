import React, { useEffect, useRef, useState } from "react";
import client from "../api/axiosClient";
import ChatBubble from "../components/ChatBubble";
import { useNavigate } from "react-router-dom";
import logo from "../assets/z_ico.ico";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [tokensLeft, setTokensLeft] = useState(null);
  const [dailyTokensUsed, setDailyTokensUsed] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef();
  const nav = useNavigate();

  useEffect(() => {
    // Load user stats and chats
    getUserProfile();
    loadChats();

    // Listen for clear chat event from Topbar
    const handleClearChat = () => {
      createNewChat();
    };

    window.addEventListener('clearChat', handleClearChat);

    return () => {
      window.removeEventListener('clearChat', handleClearChat);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getUserProfile = async () => {
    try {
      const res = await client.get("/auth/stats/");
      setTokensLeft(res.data.tokens_left ?? 10000);
      setDailyTokensUsed(res.data.daily_tokens_used ?? 0);
    } catch (err) {
      console.error("Profile error:", err);
    }
  };

  const loadChats = async () => {
    try {
      const res = await client.get("/chats/");
      setChats(res.data);
    } catch (err) {
      console.error("Error loading chats:", err);
    }
  };

  const loadChat = async (chatId) => {
    try {
      const res = await client.get(`/chats/${chatId}/`);
      setMessages(res.data.messages.map(msg => ({
        from: msg.is_user ? "user" : "ai",
        text: msg.content
      })));
      setCurrentChatId(chatId);
      setSidebarOpen(false); // Close sidebar on mobile after selecting chat
    } catch (err) {
      console.error("Error loading chat:", err);
      alert("Error loading chat. Please try again.");
    }
  };

  const createNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setSidebarOpen(false); // Close sidebar on mobile
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();

    // Add user message immediately
    const userMessage = { from: "user", text };
    setMessages(m => [...m, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const isFirstMessage = messages.length === 0;
      const res = await client.post("/advise/", {
        message: text,
        is_first_message: isFirstMessage,
        chat_id: currentChatId
      });

      const aiMessage = { from: "ai", text: res.data.reply };
      setMessages(m => [...m, aiMessage]);

      // Update tokens and chat ID
      setTokensLeft(res.data.tokens_left);
      setDailyTokensUsed(res.data.daily_tokens_used);

      // If this was a new chat, set the chat ID and reload chat list
      if (!currentChatId && res.data.chat_id) {
        setCurrentChatId(res.data.chat_id);
        // Reload chats to show the new one in sidebar
        setTimeout(() => loadChats(), 100);
      }

    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage = err.response?.data?.error || "Sorry, I encountered an error. Could you try again?";

      // Show error message to user
      setMessages(m => [...m, {
        from: "ai",
        text: errorMessage,
        isError: true
      }]);

      // Update token info if available in error response
      if (err.response?.data?.tokens_left !== undefined) {
        setTokensLeft(err.response.data.tokens_left);
      }
      if (err.response?.data?.daily_tokens_used !== undefined) {
        setDailyTokensUsed(err.response.data.daily_tokens_used);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteChat = async (chatId, e) => {
    e.stopPropagation(); // Prevent loading the chat
    if (window.confirm("Are you sure you want to delete this chat?")) {
      try {
        await client.delete(`/chats/${chatId}/delete/`);
        // If deleted chat is current chat, clear messages
        if (currentChatId === chatId) {
          createNewChat();
        }
        // Reload chat list
        loadChats();
      } catch (err) {
        console.error("Error deleting chat:", err);
        alert("Error deleting chat. Please try again.");
      }
    }
  };

  const quickSuggestions = [
    "What can you do for me?",
  ];

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <div className="chat-page">
      {/* Mobile Sidebar Toggle */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <i className={`fa ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Chat Sidebar */}
      <div className={`chat-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="btn-new-chat" onClick={createNewChat}>
            <i className="fa fa-plus me-2"></i>
            New Chat
          </button>
        </div>
        <div className="chat-list">
          {chats.length === 0 ? (
            <div className="no-chats">
              <p>No chats yet. Start a new conversation!</p>
            </div>
          ) : (
            chats.map(chat => (
              <div
                key={chat.id}
                className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
                onClick={() => loadChat(chat.id)}
              >
                <div className="chat-item-content">
                  <div className="chat-title">{chat.title}</div>
                  <div className="chat-meta">
                    {chat.message_count} messages • {new Date(chat.updated_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  className="chat-delete-btn"
                  onClick={(e) => deleteChat(chat.id, e)}
                  title="Delete chat"
                >
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">


        {/* Messages Area */}
        <div className="chat-messages-area">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <div className="welcome-container">
                <div className="welcome-icon">
                  <img src={logo} alt=" " className="logo-icon" />
                </div>
                <h1 className="welcome-title">Where should we begin?</h1>
                <div className="suggestions-grid">
                  {quickSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-card"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span className="suggestion-text">{suggestion}</span>
                      <i className="fa fa-arrow-right suggestion-arrow"></i>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="messages-container">
              {messages.map((m, i) => (
                <ChatBubble
                  key={i}
                  from={m.from}
                  text={m.text}
                  isError={m.isError}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Fixed Input at Bottom */}
        <div className="chat-input-fixed">
          <div className="chat-input-wrapper">
            <input
              className="chat-input"
              placeholder="Message ZeekingAI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={loading}
            />
            <button
              className="btn-send"
              onClick={send}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <i className="fa fa-spinner fa-spin"></i>
              ) : (
                <i className="fa fa-paper-plane"></i>
              )}
            </button>
          </div>
          <div className="chat-footer">
            <p>ZeekingAI can make mistakes. Consider checking important information.</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}