"use client";

import React, {
    useEffect,
    useRef,
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
        const authCookie = getCookie("auth");
        if (!authCookie) {
            redirect("/login");
            return;
        }

        const verifyAuthToken = async () => {
            const result = await api.get(`/api/v1/auth/verify-token/${authCookie}`);
            setMe(result.data);
        };
        verifyAuthToken();
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
        <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => {
                if (typeof document !== "undefined") {
                    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
                }
            }}
            className="h-full items-stretch"
        >
            <ResizablePanel
                defaultSize={defaultLayout[0]}
                collapsedSize={navCollapsedSize}
                collapsible={true}
                minSize={24}
                maxSize={30}
                onCollapse={() => {
                    setIsCollapsed(true);
                    if (typeof document !== "undefined") {
                        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
                    }
                }}
                onExpand={() => {
                    setIsCollapsed(false);
                    if (typeof document !== "undefined") {
                        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
                    }
                }}
                className={cn(
                    isCollapsed &&
                        "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
                )}
            >
                <Sidebar
                    me={{ current: me }} // useRef -> useState 바꿨으므로 이렇게 감싸줘야 Sidebar에 기존처럼 전달 가능
                    isCollapsed={isCollapsed}
                    links={connectedUsers}
                    setConnectedUsers={setConnectedUsers}
                    setSelectedUser={setSelectedUser}
                    setMessages={setMessages}
                />
            </ResizablePanel>

            {selectedUser && (
                <>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
                        <Chat
                            messagesState={messagesState}
                            me={{ current: me }}
                            client={client}
                            selectedUser={selectedUser}
                            setSelectedUser={setSelectedUser}
                        />
                    </ResizablePanel>
                </>
            )}
        </ResizablePanelGroup>
    );
}
