import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useMessageStore = create((set, get) => ({
  contacts: null,
  isFetchingUsers: false,
  currentContactId: null,
  messages: null,
  isGettingMessages: false,
  isSendingMessage: false,

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
      const { currentContactId } = get(); // Access currentContactId from the state
      if (!currentContactId) return;
      const res = await axiosInstance.get(`/message/${currentContactId}`);
      set({ messages: res.data });
    } catch (error) {
      console.log("Error in getMessages:", error);
      toast.error(error.response?.data?.msg || "Failed to fetch messages");
      set({ messages: null });
    } finally {
      set({ isGettingMessages: false });
    }
  },

  sendMessage: async ({ text, image }) => {
    set({ isSendingMessage: true });
    try {
      const { currentContactId } = get(); // Access currentContactId from the state
      const res = await axiosInstance.post(`/message/send/${currentContactId}`, {
        text,
        image,
      });

      // Update messages state by adding the new message
      set((state) => ({
        messages: state.messages ? [...state.messages, res.data] : [res.data],
      }));

    } catch (error) {
      console.log("Error in sendMessage:", error);
      toast.error(error.response?.data?.msg || "Failed to send message");
    } finally {
      set({ isSendingMessage: false });
    }
  },
}));