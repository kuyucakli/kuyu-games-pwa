import { create } from "zustand";

export type MessageType = "info" | "warning" | "error" | "success";

export interface Message {
  id: string;
  text: string;
  type: MessageType;
}

interface MessageStore {
  messages: Message[];
  addMessage: (message: Omit<Message, "id">) => void;
  removeMessage: (id: string) => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { ...message, id: crypto.randomUUID() }],
    })),
  removeMessage: (id) =>
    set((state) => ({ messages: state.messages.filter((m) => m.id !== id) })),
}));
