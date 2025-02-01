import { useAuthStore } from "@/store/useAuthStore";
import { useMessageStore } from "@/store/useMessageStore";
import React from "react";

export function ContactItem({ contact }) {
  const { setCurrentContactId, currentContactId } = useMessageStore();
  const { onlineUsers } = useAuthStore();
  let online ;
  for (let i = 0; i < onlineUsers.length; i++) {
    if (onlineUsers[i] === contact._id) {
      online = true;
      break;
    } else {
      online = false;
    }
  }
  const currentContact = currentContactId === contact._id;
  console.log(online );

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
            {online && (
              <div className="absolute w-3 h-3 right-1  opacity-80 bg-green-500 rounded-full "></div>)}
            <img src={contact.profilePic || "https://images.unsplash.com/photo-1606663889134-b1dedb5ed8b7?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt={contact.name} />
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
