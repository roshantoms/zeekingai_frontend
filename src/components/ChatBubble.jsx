import React from "react";
import ReactMarkdown from 'react-markdown';

export default function ChatBubble({ from = "ai", text }) {
  const isUser = from === "user";

  return (
    <div className={`chat-bubble ${isUser ? 'user' : 'ai'}`}>
      <div className="bubble-content">
        <div className="bubble-avatar">
          {isUser ? (
            <i className="fa fa-user"></i>
          ) : (
            <i className="fa fa-robot"></i>
          )}
        </div>
        <div className="bubble-text">
          <ReactMarkdown
            components={{
              table: ({node, ...props}) => (
                <div className="table-container">
                  <table {...props} />
                </div>
              ),
              ul: ({node, ...props}) => (
                <ul className="custom-list" {...props} />
              ),
              ol: ({node, ...props}) => (
                <ol className="custom-list" {...props} />
              ),
            }}
          >
            {text}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}