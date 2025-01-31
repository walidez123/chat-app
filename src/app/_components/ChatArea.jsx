import React, { useEffect, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { useMessageStore } from "@/store/useMessageStore";
import toast from "react-hot-toast";

export function ChatArea() {
  const {
    currentContactId,
    getMessages,
    messages,
    isGettingMessages,
    sendMessage,
  } = useMessageStore();
  const [newMessage, setNewMessage] = useState(""); // State for the new message input

  // Fetch messages when the currentContactId changes
  useEffect(() => {
    if (currentContactId) {
      getMessages();
    }
  }, [currentContactId]);

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    if (!newMessage) {
      toast.error("please write a message");
    }
    if (!newMessage.trim() || !currentContactId) return; // Don't send empty messages

    await sendMessage({ text: newMessage, image: null }); // Call the sendMessage function from the store
    setNewMessage(""); // Clear the input after sending
  };

  // Render loading state if messages are being fetched
  if (isGettingMessages) {
    return (
      <div className=" flex-1 flex items-center justify-center bg-base-200 text-white">
        <p className="animate-pulse text-xl"> Loading messages...</p>
      </div>
    );
  }

  // Render placeholder if no contact is selected
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

  // Render placeholder if messages are not loaded yet
  if (!messages) {
    return (
      <div className="animate-pulse flex-1 flex items-center justify-center bg-base-200 text-white">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-base-200 text-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          // Render messages if there are any
          messages.map((message) => {
            // Ensure timestamp is valid
            // const timestamp = message.timestamp ? new Date(message.timestamp) : null;
            // const formattedTime = timestamp ? timestamp.toLocaleTimeString() : "Invalid date";
            return (
              <div
                key={message._id}
                className={`chat ${
                  message.sender._id === currentContactId
                    ? "chat-start"
                    : "chat-end"
                }`}
              >
                <div className="chat-header text-gray-300 m-1">
                  {message.sender.name}
                </div>
                <div
                  className={`chat-bubble ${
                    message.sender._id === currentContactId
                      ? "chat-bubble-secondary"
                      : "chat-bubble-primary"
                  }`}
                >
                  {message.text}
                </div>
                <div className="chat-footer opacity-50">
                  {/* {formattedTime} */}
                </div>
              </div>
            );
          })
        ) : (
          // Render placeholder if there are no messages
          <div className="animate-pulse flex-1 flex items-center justify-center bg-gray-100">
            No messages here.
          </div>
        )}
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
          <button type="submit" className="btn btn-primary">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
