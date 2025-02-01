'use client'
import React, { useEffect } from "react";
import { MessageSquare, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { ContactItem } from "./contact";
import { useMessageStore } from "@/store/useMessageStore";
import Link from "next/link";
export function Sidebar({ isOpen }) {
  const {  logout  } = useAuthStore();
  const {  contacts  } = useMessageStore();

  const handleLogout = async () => {
    await logout();
  };

  if(!contacts){
    return(
      <div>
        Loading...
      </div>
    )
  }
 
  return (
    <div
      className={`${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:relative w-64 h-full transition-transform duration-300 ease-in-out z-30`}
    >
      <div className="h-full bg-base-200 text-base-content p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="w-6 h-6" />
          <h1 className="text-xl font-bold">Chat App</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {contacts.map((contact) => (
              <ContactItem key={contact._id} contact={contact} />
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-base-300">
          <Link href={'/profile'} className="btn btn-ghost w-full justify-start gap-2">
            <Settings className="w-5 h-5" />
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="btn btn-ghost w-full justify-start gap-2 text-error"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
