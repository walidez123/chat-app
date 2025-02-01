import React, { useEffect, useRef, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { useMessageStore } from "@/store/useMessageStore";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

export function ChatArea() {
  const {
    currentContactId,
    getMessages,
    messages = [],
    isGettingMessages,
    sendMessage,
    listenToMessages,
    unListenToMessages,
  } = useMessageStore();
  const { socket } = useAuthStore();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const previousMessagesCount = useRef(messages.length);
  const soundRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Play sound when a new message is received
  useEffect(() => {
    if (messages.length > previousMessagesCount.current) {
      soundRef.current?.play();
    }
    previousMessagesCount.current = messages.length;
  }, [messages]);

  // Fetch messages when the currentContactId changes
  useEffect(() => {
    listenToMessages(socket);
    if (currentContactId) {
      getMessages();
    }
    return () => unListenToMessages(socket);
  }, [currentContactId]);

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      toast.error("Please write a message");
      return;
    }

    if (!currentContactId) return;

    try {
      await sendMessage({ text: newMessage, image: null });
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  if (isGettingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base-200 text-white">
        <p className="animate-pulse text-xl">Loading messages...</p>
      </div>
    );
  }

  if (!currentContactId) {
    return (
      <div className="flex-1 flex flex-col gap-4 items-center justify-center bg-base-200 text-gray-300">
        <div className="animate-bounce">
          <MessageSquare size={50} />
        </div>
        <div>Select a contact to start chatting</div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col gap-4 items-center justify-center bg-base-200 text-gray-300">
        <div className="animate-bounce">
          <MessageSquare size={50} />
        </div>
        <div>No messages here</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-base-200 text-white">
      {/* Hidden audio element for notification sound */}
      <audio ref={soundRef} src="/sounds/notification.mp3" preload="auto" />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const timestamp = message.timestamp
            ? new Date(message.timestamp)
            : null;
          const formattedTime = timestamp
            ? timestamp.toLocaleTimeString()
            : "Invalid date";

          return (
            <div
              key={message._id}
              className={`chat ${
                message.sender._id === currentContactId ||
                message.sender === currentContactId
                  ? "chat-start"
                  : "chat-end"
              }`}
            >
              <div className="chat-header text-gray-300 m-1">
                {message.sender.name}
              </div>
              <div
                className={`chat-bubble ${
                  message.sender._id === currentContactId ||
                  message.sender === currentContactId
                    ? "chat-bubble-secondary"
                    : "chat-bubble-primary"
                }`}
              >
                {message.text}
              </div>
              <div className="chat-footer opacity-50">{formattedTime}</div>
            </div>
          );
        })}
        {/* Empty div to scroll into view */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-base-200 text-white">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="input input-bordered flex-1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
