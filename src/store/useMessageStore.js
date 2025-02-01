import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useMessageStore = create((set, get) => ({
  contacts: null,
  isFetchingUsers: false,
  currentContactId: null,
  messages: [], // Always initialize as an empty array
  isGettingMessages: false,
  isSendingMessage: false,

  listenToMessages: (socket) => {
    const { currentContactId } = get();
    if (!currentContactId) return;

    socket.on(`newMessage`, (message) => {
      set((state) => ({
        messages: [...state.messages, message], // Ensure messages is always an array
      }));
    });
  },

  unListenToMessages: (socket) => {
    socket.off(`newMessage`);
  },

  getContacts: async () => {
    try {
      set({ isFetchingUsers: true });
      const res = await axiosInstance.get("/message/users");
      set({ contacts: res.data });
    } catch (error) {
      console.log("Error in getContacts:", error);
      toast.error(error.response?.data?.msg || "Failed to fetch contacts");
      set({ contacts: null });
    } finally {
      set({ isFetchingUsers: false });
    }
  },

  setCurrentContactId: (contactId) => {
    set({ currentContactId: contactId });
  },

  getMessages: async () => {
    set({ isGettingMessages: true });
    try {
      const { currentContactId } = get();
      if (!currentContactId) return;

      const res = await axiosInstance.get(`/message/${currentContactId}`);
      set({ messages: res.data || [] }); // Ensure messages is always an array
    } catch (error) {
      console.log("Error in getMessages:", error);
      toast.error(error.response?.data?.msg || "Failed to fetch messages");
      set({ messages: [] }); // Set to empty array instead of null
    } finally {
      set({ isGettingMessages: false });
    }
  },

  sendMessage: async ({ text, image }) => {
    set({ isSendingMessage: true });
    try {
      const { currentContactId } = get();
      const res = await axiosInstance.post(`/message/send/${currentContactId}`, {
        text,
        image,
      });

      set((state) => ({
        messages: [...state.messages, res.data], // Add new message to the array
      }));
    } catch (error) {
      console.log("Error in sendMessage:", error);
      toast.error(error.response?.data?.msg || "Failed to send message");
    } finally {
      set({ isSendingMessage: false });
    }
  },
}));