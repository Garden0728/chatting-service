"use client";
import {
    Tabs,
    Tab,
    Box,
    Dialog,
    DialogContent,
    TextField,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import * as StompJs from "@stomp/stompjs";
import {useEffect, useRef, useState} from "react";
import {User, Message} from "@/app/data";
import api from "@/lib/axios";
import {useChatActions} from "@/context/ChatActionsContext";

import FriendList from "./friend/FriendList";
import {ChatList} from "./chat/chat-list";
import FriendRequests from "./friend/FriendRequests";

interface SidebarProps {
    me: string | null;
    isCollapsed: boolean;
    links: User[];
    messages: Message[];
}

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
        headers: {Authorization: `Bearer ${token}`},
    });

    return response.data.users.map((user: { id: number; name: string }) => ({
        id: user.id,
        name: user.name,
        messages: [],
    }));
};

export function Sidebar({me, links, isCollapsed, messages}: SidebarProps) {
    // ✅ Context에서 세터 함수들 받아오기
    const {setConnectedUsers, setSelectedUser, setMessages, onChangeChat} =
        useChatActions();

    const sendMessage = (newMessage: Message) => {
        setMessages((prev) => [...prev, newMessage]);
    };

    const [tab, setTab] = useState<"chats" | "friends">("friends");
    const [meId, setMeId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const clientRef = useRef<StompJs.Client | null>(null);
    const [selectedUser, setSelectedUserState] = useState<User | null>(null);
    const openSearchModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const handleTabChange = (_: React.SyntheticEvent, newValue: string) =>
        setTab(newValue as "chats" | "friends");

    const handleSearch = async () => {
        const users = await fetchUsers(searchQuery);
        setSearchResults(users);
    };

    const handleAddFriend = async (friendId: number) => {
        try {
            const token = getCookie("auth");
            await api.post(`/api/v1/friend/add/${friendId}`, null, {
                headers: {Authorization: `Bearer ${token}`},
            });
            alert("친구 요청 보냈습니다!");
        } catch (error) {
            console.error("친구 요청 실패", error);
            alert("요청 실패");
        }
    };
    const handleChangeChat = (user: User) => onChangeChat(user);
   /* const handleChangeChat =  (user: User) => {
        const result = await api.get("/api/v1/chat/chat-list", {
            params: {
                name: user.name,
                from: me, // ✅ 더 이상 me.current 아님
            },
        });

        setMessages(result.data.result);
        window.localStorage.setItem("selectedUser", JSON.stringify(user));

        setSelectedUser(user); // Context 세터
        setSelectedUserState(user);
        setConnectedUsers((prev) => {
            if (prev.find((u) => u.id === user.id)) return prev;
            return [...prev, user];
        });
    };*/

    useEffect(() => {
        const token = getCookie("auth");
        if (!token) return;
        api.get(`/api/v1/auth/verify-token-id/${token}`).then((res) => {
            setMeId(res.data);
        });
    }, []);

    return (
        <div className="flex flex-col h-full">
            {/* ✅ 탭 전환 */}
            <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                <Tabs
                    value={tab}
                    onChange={handleTabChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    variant="fullWidth"
                >
                    <Tab label="채팅방" value="chats"/>
                    <Tab label="친구목록" value="friends"/>
                </Tabs>
            </Box>

            {tab === "friends" && (
                <div className="flex justify-end p-2">
                    <IconButton onClick={openSearchModal}>
                        <SearchIcon/>
                    </IconButton>
                </div>
            )}

            <div className="flex-1 overflow-y-auto">
                {tab === "chats" && selectedUser && (
                    <ChatList
                        me={me}
                        messages={messages}
                        selectedUser={selectedUser}
                        sendMessage={sendMessage}
                    />
                )}
                {tab === "friends" && (
                    <>
                        <FriendList/>
                        <FriendRequests/>
                    </>
                )}
            </div>

            <Dialog open={showModal} onClose={closeModal} maxWidth="sm" fullWidth>
                <DialogContent>
                    <TextField
                        fullWidth
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={handleSearch}>
                                    <SearchIcon/>
                                </IconButton>
                            ),
                        }}
                    />
                    <List>
                        {searchResults.length > 0 ? (
                            searchResults.map((user) => (
                                <ListItem
                                    key={user.id}
                                    component="button"
                                    onClick={() => {
                                        handleChangeChat(user);
                                        closeModal();
                                    }}
                                    secondaryAction={
                                        <Button
                                            variant="contained"
                                            size="small"
                                            className="!bg-blue-600 !text-white hover:!bg-blue-700"
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
        </div>
    );
}
