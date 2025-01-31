"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { Sidebar } from "./_components/sidebar";
import { ChatArea } from "./_components/ChatArea";
import Link from "next/link";
import { useMessageStore } from "@/store/useMessageStore";

export default function Home() {
  const { authUser, checkAuth, isCheckingAuth,onlineUsers } = useAuthStore();
  const {  getContacts } = useMessageStore();

  const [isSidebarOpen, setSidebarOpen] = useState(false);


  useEffect(() => {
    checkAuth();
    getContacts();
    console.log(onlineUsers)
  }, [checkAuth,onlineUsers]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (isCheckingAuth) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-base-300 bg-opacity-50 flex items-center justify-center">
        <span className="loading loading-spinner text-white loading-lg"></span>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#1d232a] text-white">
        <h1>
          To use the app please login from here{" "}
          <Link href={"/auth"} className="underline">
            LOGIN
          </Link>
        </h1>
      </div>
    );
  }

  return (
    <div className="h-screen relative">
      {/* Mobile Sidebar Toggle Button */}
      <button
  className="lg:hidden p-0 w-10 h-10 top-[50%] fixed z-20 bg-gray-400 text-white shadow-md rounded-r-full clip-triangle-left transform transition-transform hover:opacity-100 opacity-50"
  onClick={toggleSidebar}
>
  ☰
</button>


      {/* Sidebar and Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar} // Close sidebar when overlay is clicked
        ></div>
      )}
      <div className="flex h-full relative">
        <Sidebar isOpen={isSidebarOpen} />
        <ChatArea/>
      </div>
    </div>
  );
}
