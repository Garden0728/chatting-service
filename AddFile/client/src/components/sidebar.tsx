"use client";


import Link from "next/link";
import {Search} from "lucide-react";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import type {ReceiveRequest} from "@/types/friends";
import * as StompJs from "@stomp/stompjs";

import {fetchInitialChatUsers} from "@/lib/sidebar_utils";
// 상단 import에 추가 필요
import {useEffect, useRef, useState} from "react";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import {Avatar, AvatarImage} from "./ui/avatar";
import {User, Message} from "@/app/data";
import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "@mui/material/styles"; // MUI 스타일 추가
import api from "@/lib/axios";

interface SidebarProps {
    me: React.RefObject<String>;
    isCollapsed: boolean;
    links: User[];
    setConnectedUsers: React.Dispatch<React.SetStateAction<User[]>>;
    setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;

}


/*
const searchResult = (name: string): User => {
    return {
        name,
        messages: [], // 기본값으로 빈 배열

    };
};
*/

const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    if (match) return match[2];
    return null;
};

export const fetchUsers = async (searchQuery: string): Promise<User[]> => {
    const token = getCookie("auth");

    if (!token) {
        throw new Error("Authentication token not found in cookies");
    }

    const response = await api.get(`/api/v1/user/search/${searchQuery}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data.users.map((user: { id: number; name: string }) => ({
        id: user.id,
        name: user.name,
        messages: [],

    }));
    /*const names = response.data.name;

    return names.map((n: string) => searchResult(n));*/
};

export function Sidebar({
                            me,
                            links,
                            isCollapsed,
                            setConnectedUsers,
                            setSelectedUser,
                            setMessages,
                        }: SidebarProps) {
    const [tab,setTab] = useState<"chats" | "friends">("chats");
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const [searchResults, setSearchResults] = React.useState<User[]>([]);
    const [friendRequests, setFriendRequests] = React.useState<ReceiveRequest[]>([]);
    const [meId, setMeId] = useState<number | null>(null);
    const clientRef = useRef<StompJs.Client | null>(null);
    useEffect(() => {
        const token = getCookie("auth");
        if (!token) return;

        api.get(`/api/v1/auth/verify-token-id/${token}`).then((res) => {
            setMeId(res.data);  // 서버에서 userId(Long) 반환
        });
    }, []);

    useEffect(() => {
        const token = getCookie("auth");
        if (!token) return;

        // 친구 리스트 가져오기
        // api.get("/api/v1/friend/list", {
        //     headers: {Authorization: `Bearer ${token}`}
        // }).then(res => {
        //     setConnectedUsers(res.data.FriendList); // 서버 응답 필드 이름 맞춰서 변경
        // });

        // 친구 요청 리스트 가져오기
        api.get("/api/v1/friend/Take-Request-friend", {
            headers: {Authorization: `Bearer ${token}`}
        }).then(res => {
            setFriendRequests(res.data.UserList);
        });
    }, []);

    useEffect(() => {
        if (!meId) return;

        const c = new StompJs.Client({
            brokerURL: "ws://localhost:7002/ws-stomp",
            reconnectDelay: 5000,
        });

        c.onConnect = () => {
            c.subscribe(`/sub/friend/${meId}`, (message) => {
                const data = JSON.parse(message.body);
                setFriendRequests((prev) => [
                    ...prev,
                    {
                        name: data.senderName,
                        sendID: data.senderId,
                        receiveID: data.receiverId,
                        createdAt: data.createdAt,
                    },
                ]);
            });
        };
        c.activate();
        clientRef.current = c;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate(); // Promise지만 무시하고 호출
            }

        };

        /*fetchInitialChatUsers(setConnectedUsers, setFriendRequests);*/
    }, [meId]);

    /*useEffect(() => {
        console.log("💡 friendRequests updated", friendRequests);
    }, [friendRequests]);*/

    // useEffect(() => {
    //     const fetchInitialChatUsers = async () => {
    //         const token = getCookie("auth");
    //         if (!token) return;
    //
    //         const meRes = await api.get(`/api/v1/auth/verify-token/${token}`);
    //         const userName = meRes.data;
    //
    //         const res = await api.get("/api/v1/chat/chat-record", {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             params: {
    //                 name: userName,
    //             },
    //         });
    //
    //         const userList = res.data.name.map((n: string) => ({
    //             name: n,
    //             messages: [],
    //         }));
    //
    //         setConnectedUsers(userList);
    //     };
    //
    //     fetchInitialChatUsers();
    // }, []);

    const handleSearch = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleSearchQueryChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const query = event.target.value;

        setSearchQuery(query);
    };

    const handelSearchButton = async (event: any) => {
        const users = await fetchUsers(searchQuery);
        setSearchResults(users);
    };
    const handleAddFriend = async (friendId: number) => {
        try {
            const token = getCookie("auth");
            await api.post(`/api/v1/friend/add/${friendId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("친구 요청 보냈습니다!");
            const frRes = await api.get("/api/v1/friend/Take-Request-friend", {
                headers: {
                    Authorization: `Bearer ${token}`,

                },
            });
            setFriendRequests(frRes.data.UserList);
        } catch (error) {
            console.error("친구 요청 실패", error);
            alert("요청 실패");
        }
    };


    const addFriends = async (user: User) => {
        setConnectedUsers((prevUsers) => {
            // user.id가 이미 prevUsers 배열에 있는지 확인
            const userExists = prevUsers.some(
                (existingUser) => existingUser.name === user.name
            );

            if (userExists) {
                // 이미 존재하는 경우 아무것도 하지 않음
                return prevUsers;
            }

            // 존재하지 않는 경우에만 추가
            return [...prevUsers, user];
        });
    };

    const handleChangeChat = async (link: User) => {
        const result = await api.get("/api/v1/chat/chat-list", {
            params: {
                name: link.name,
                from: me.current,
            },
        });

        setMessages(result.data.result);

        window.localStorage.setItem("selectedUser", JSON.stringify(link));
        setSelectedUser(link);
    };



    return (
        <div
            data-collapsed={isCollapsed}
            className="relative group flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 "
        >
            <Dialog open={showModal} onClose={closeModal} maxWidth="sm" fullWidth>
                <DialogContent>
                    <div className="flex items-center">
                        <TextField
                            fullWidth
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                            InputProps={{
                                endAdornment: (
                                    <IconButton edge="end" color="primary">
                                        <SearchIcon onClick={handelSearchButton}/>
                                    </IconButton>
                                ),
                            }}
                        />
                    </div>
                    <List>
                        {searchResults.length > 0 ? (
                            searchResults.map((user, index) => (
                                <ListItem
                                    key={index}
                                    onClick={() => handleChangeChat(user)}
                                    secondaryAction={
                                        <Button
                                            variant="contained"
                                            size="small"
                                            style={{
                                                backgroundColor: "blueviolet",
                                                color: "white",
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddFriend(user.id);
                                            }}
                                        >
                                            +
                                        </Button>


                                    }
                                >
                                    <ListItemText primary={user.name}/>
                                </ListItem>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText primary="No results found"/>
                            </ListItem>
                        )}
                    </List>
                </DialogContent>
            </Dialog>
            {!isCollapsed && (
                <div className="flex justify-between p-2 items-center">
                    <div className="flex gap-2 items-center text-2xl">
                        <p className="font-medium">Chats</p>
                        <span className="text-zinc-300">({links.length})</span>
                    </div>

                    <div>
                        <Link
                            href="#"
                            className={cn(
                                buttonVariants({variant: "ghost", size: "icon"}),
                                "h-9 w-9"
                            )}
                        >
                            <Search size={20} onClick={handleSearch}/>
                        </Link>
                    </div>
                </div>
            )}
            <nav
                className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                {links.map((link, index) =>
                    isCollapsed ? (
                        <TooltipProvider key={index}>
                            <Tooltip key={index} delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="#"
                                        className={cn(
                                            buttonVariants({variant: "grey", size: "icon"}),
                                            "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                                        )}
                                    >
                                        <span className="sr-only">{link.name}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="right"
                                    className="flex items-center gap-4"
                                >
                                    {link.name}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <Link
                            key={index}
                            href="#"
                            className={cn(
                                buttonVariants({variant: "grey", size: "xl"}), // link.variant === "grey" &&
                                "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white shrink"
                            )}
                            onClick={() => {
                                handleChangeChat(link);
                            }}
                        >
                            <div className="flex flex-col max-w-28">
                                <span>{link.name}</span>
                                {link.messages.length > 0 && (
                                    <span className="text-zinc-300 text-xs truncate ">
                    {link.messages[link.messages.length - 1].from.split(" ")[0]}
                                        : {link.messages[link.messages.length - 1].message}
                  </span>
                                )}
                            </div>
                        </Link>
                    )
                )}
            </nav>
            {friendRequests.length > 0 && (
                <div className="px-2">
                    <p className="text-sm font-semibold mb-2">받은 친구 요청</p>
                    <ul className="space-y-1">
                        {friendRequests.map((req) => (
                            <li key={req.sendID}
                                className="bg-muted rounded px-3 py-2 flex justify-between items-center">
                                <span>{req.name}</span>
                                <div className="flex space-x-1">
                                    <button className="text-green-500 text-sm hover:underline">수락</button>
                                    <button className="text-red-500 text-sm hover:underline">거절</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>



    );
}
