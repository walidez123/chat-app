import { useAuthStore } from "@/store/useAuthStore";
import { useMessageStore } from "@/store/useMessageStore";
import React from "react";

export function ContactItem({ contact }) {
  const { setCurrentContactId, currentContactId } = useMessageStore();
  const { logout, onlineUsers } = useAuthStore();
  let online ;
  if (onlineUsers.includes(currentContactId)) {
    online = true;
  } else {
    online = false;
  }
  const currentContact = currentContactId === contact._id;

  const handleClick = () => {
    setCurrentContactId(contact._id);
  };

  return (
    <button
      onClick={handleClick}
      key={contact._id}
      className={`btn  w-full h-auto justify-start p-2 ${
        currentContact ? "bg-primary text-white" : ""
      }`}
    >
      <div className="flex items-center gap-3 w-full">
        <div className="avatar">
          <div className="w-12 h-12 rounded-full">
            <img src={contact.profilePic} alt={contact.name} />
            {online && (
              <div className="absolute w-3 h-3 bg-success-500 rounded-full bottom-0 right-0"></div>)}
          </div>
        </div>
        <div className="flex-1 text-left">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{contact.name}</span>
            <span className="text-xs opacity-50">{contact.timestamp}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm opacity-70 truncate">{contact.lastMessage}</p>
            {contact.unread && (
              <div className="badge badge-primary badge-sm">
                {contact.unread}
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
