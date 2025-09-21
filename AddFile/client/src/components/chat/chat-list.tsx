import {Message, User} from "@/app/data";
import {cn} from "@/lib/utils";
import React, {useRef, useState} from "react";
import {Avatar, AvatarImage} from "../ui/avatar";
import ChatBottombar from "./chat-bottombar";
import { useChatActions } from "@/context/ChatActionsContext";
import {AnimatePresence, motion} from "framer-motion";
import {Client} from "@stomp/stompjs";

interface ChatListProps {
    me: string | null;
    messages?: Message[];
    selectedUser: User;
    sendMessage: (newMessage: Message) => void;
}

export function ChatList({
                             me,
                             messages,
                             selectedUser,
                             sendMessage,
                         }: ChatListProps) {
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const { fetchWordDictionary, setMessages } = useChatActions();

    React.useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);
    const handleHover = async (index: number, message: Message) => {
    setHoveredIdx(index);
    if (!message.words?.length && fetchWordDictionary) {
      const words = await fetchWordDictionary(message.message);
      message.words = words;
      setMessages((prev) => [...prev]); // 상태 갱신
    }
  };

    return (
        <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
            <div
                ref={messagesContainerRef}
                className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
            >
                <AnimatePresence>
                    {messages?.map((message, index) => (
                        <motion.div
                            key={index}
                            layout
                            initial={{opacity: 0, scale: 1, y: 50, x: 0}}
                            animate={{opacity: 1, scale: 1, y: 0, x: 0}}
                            exit={{opacity: 0, scale: 1, y: 1, x: 0}}
                            transition={{
                                opacity: {duration: 0.1},
                                layout: {
                                    type: "spring",
                                    bounce: 0.3,
                                    duration: messages.indexOf(message) * 0.05 + 0.2,
                                },
                            }}
                            style={{
                                originX: 0.5,
                                originY: 0.5,
                            }}
                            className={cn(
                                "flex flex-col gap-2 p-4 whitespace-pre-wrap relative",
                                message.from !== selectedUser.name ? "items-end" : "items-start"
                            )}
                            onMouseEnter={() => handleHover(index, message)}
                            onMouseLeave={() => setHoveredIdx(null)}
                        >
                            <div className="flex gap-3 items-center">
                                {message.from === selectedUser.name && (
                                    <Avatar className="flex justify-center items-center">
                                        <AvatarImage alt={message.from} width={6} height={6}/>
                                    </Avatar>
                                )}
                                <span className=" bg-accent p-3 rounded-md max-w-xs">
                  {message.message}
                </span>
                                {message.from !== selectedUser.name && (
                                    <Avatar className="flex justify-center items-center">
                                        <AvatarImage alt={message.from} width={6} height={6}/>
                                    </Avatar>
                                )}
                            </div>
                            {hoveredIdx === index && message.words?.length ? (
                                <div
                                    className={cn(
                                        "absolute top-full mt-1 bg-white border p-2 rounded shadow-md z-10 max-w-xs",
                                        message.from === selectedUser.name ? "left-0" : "right-0"
                                    )}
                                >
                                    {message.words.map((w, i) => (
                                        <div key={i}>
                                            <strong>{w.word_name}</strong>: {w.detail}
                                        </div>
                                    ))}
                                </div>

                            ) : null}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            <ChatBottombar
                me={me}
                selectedUser={selectedUser}
                sendMessage={sendMessage}
            />
        </div>
    );
}
