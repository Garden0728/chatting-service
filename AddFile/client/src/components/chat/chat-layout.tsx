"use client";

import ChatActionsContext from "@/context/ChatActionsContext";
import React, {
    useEffect,
    useState,
} from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import {cn} from "@/lib/utils";
import {Sidebar} from "../sidebar";
import {Chat} from "./chat";
import {User, Message} from "@/app/data";
import api from "@/lib/axios";
import {redirect} from "next/navigation";
import * as StompJs from "@stomp/stompjs";

interface ChatLayoutProps {
    defaultLayout: number[] | undefined;
    defaultCollapsed?: boolean;
    navCollapsedSize: number;
}

function getCookie(name: string): string | undefined {
    if (typeof document === "undefined") return;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
}

export function ChatLayout({
                               defaultLayout = [320, 480],
                               defaultCollapsed = false,
                               navCollapsedSize,
                           }: ChatLayoutProps) {
    const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [me, setMe] = useState<string | null>(null);
    const [client, setClient] = useState<StompJs.Client | null>(null);
    const [messagesState, setMessages] = useState<Message[]>(
        selectedUser?.messages ?? []
    );
    useEffect(() => {
        if (!me) return;                          // 내 정보 준비 후
        const item = window.localStorage.getItem("selectedUser");
        if (!item) return;

        try {
            const savedUser: User = JSON.parse(item);
            // ✅ 같은 onChangeChat 로직 재사용
            void handleChangeChat(savedUser);
        } catch (e) {
            console.error("saved selectedUser 파싱 실패:", e);
        }
    }, [me]);


    useEffect(() => {
        const authCookie = getCookie("auth");
        if (!authCookie) {
            redirect("/login");
            return;
        }

        (async () => {
            const result = await api.get(`/api/v1/auth/verify-token/${authCookie}`);
            setMe(result.data);
        })();
    }, []);

    useEffect(() => {
        const authCookie = getCookie("auth");
        if (!authCookie || !me || client !== null) return;

        const C = new StompJs.Client({
            brokerURL: "ws://localhost:7002/ws-stomp",
            connectHeaders: {
                Authorization: `Bearer ${authCookie}`,
            },
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("connected");
                subscribe(C);
            },
            onWebSocketError: (error) => {
                console.log("Error with websocket", error);
            },
            onStompError: (frame) => {
                console.dir(`Broker reported error: ${frame.headers.message}`);
                console.dir(`Additional details: ${frame}`);
            },
        });

        setClient(C);
        C.activate();
    }, [me, client]);
    // ❶ return 위에 “함수”로 선언 (토큰/헤더 포함)
    const handleChangeChat = async (user: User) => {
        const token = getCookie("auth");
        if (!me || !token) return;

        setSelectedUser(user);
        window.localStorage.setItem("selectedUser", JSON.stringify(user));

        try {
            const res = await api.get("/api/v1/chat/chat-list", {
                params: {name: user.name, from: me}, // 서버 요구가 ID면 from: meId로
                headers: {Authorization: `Bearer ${token}`},
            });
            setMessages(res.data?.result ?? []);
        } catch (e) {
            console.error("채팅 기록 불러오기 실패:", e);
            setMessages([]);
        }

        setConnectedUsers((prev) =>
            prev.find((u) => u.id === user.id) ? prev : [...prev, user]
        );
    };


    const subscribe = (clientInstance: StompJs.Client) => {
        console.log("Subscribing...");
        clientInstance.subscribe(
            `/sub/chat/${me}`,
            (received_message) => {
                const message: Message = JSON.parse(received_message.body);
                const item = window.localStorage.getItem("selectedUser");

                if (!me) return;


                if (item != null) {
                    const user: User = JSON.parse(item);
                    if (message.to === user.name || message.from === user.name) {
                        setMessages((prevMessages) => [...prevMessages, message]);
                    }
                }
            }
        );
    };

    return (
        <ChatActionsContext.Provider
            value={{
                setConnectedUsers,
                setSelectedUser,
                setMessages,
                onChangeChat: handleChangeChat, // ✅ 분리한 함수 그대로 전달
                onEmojiSelect: (emoji: string) => {
                    if (!me || !selectedUser) return;
                    const newMessage: Message = {from: me, to: selectedUser.name, message: emoji};
                    client?.publish({
                        destination: `/pub/chat/message/${me}`,
                        body: JSON.stringify(newMessage),
                    });
                },
            }}
        >
            <ResizablePanelGroup
                direction="horizontal"
                className="h-full items-stretch"
            >
                <ResizablePanel
                    defaultSize={defaultLayout[0]}
                    collapsedSize={navCollapsedSize}
                    collapsible
                    minSize={24}
                    maxSize={30}
                    onCollapse={() => setIsCollapsed(true)}
                    onExpand={() => setIsCollapsed(false)}
                    className={cn(
                        isCollapsed &&
                        "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
                    )}
                >
                    <Sidebar
                        me={me}
                        isCollapsed={isCollapsed}
                        links={connectedUsers}
                        messages={messagesState}
                    />
                </ResizablePanel>

                {selectedUser && (
                    <>
                        <ResizableHandle withHandle/>
                        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
                            <Chat
                                messagesState={messagesState}
                                me={me}
                                client={client}
                                selectedUser={selectedUser}
                                setSelectedUser={setSelectedUser}
                            />
                        </ResizablePanel>
                    </>
                )}
            </ResizablePanelGroup>
        </ChatActionsContext.Provider>
    );
}
