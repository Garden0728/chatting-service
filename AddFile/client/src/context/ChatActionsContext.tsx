"use client";

import {createContext, useContext} from "react";
import type {User, Message} from "@/app/data";

type ChatActionsContextType = {
    setConnectedUsers: React.Dispatch<React.SetStateAction<User[]>>;
    setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    onChangeChat: (user: User) => void;
    onEmojiSelect?: (emoji: string) => void;
};

const ChatActionsContext = createContext<ChatActionsContextType | null>(null);

export const useChatActions = () => {
    const ctx = useContext(ChatActionsContext);
    if (!ctx) {
        throw new Error("useChatActions must be used inside ChatActionsProvider");
    }
    return ctx;
};

export default ChatActionsContext;
