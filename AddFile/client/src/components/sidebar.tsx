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
    ListItemButton,
    Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import * as StompJs from "@stomp/stompjs";
import {useEffect, useRef, useState} from "react";
import {User, Message} from "@/app/data";
import api from "@/lib/axios";

import FriendList from "./friend/FriendList";
import {ChatList} from "./chat/chat-list";
import FriendRequests from "./friend/FriendRequests";

interface SidebarProps {
    me: React.RefObject<string>;
    isCollapsed: boolean;
    links: User[];
    setConnectedUsers: React.Dispatch<React.SetStateAction<User[]>>;
    setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
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
                            messages
                        }: SidebarProps) {


    const sendMessage = (newMessage: Message) => {
        setMessages((prev) => [...prev, newMessage]);
    };
    const [tab, setTab] = useState<"chats" | "friends">("chats");

    const [meId, setMeId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const clientRef = useRef<StompJs.Client | null>(null);
    // Sidebar 컴포넌트 내부에 이거 추가
    const [selectedUser, setSelectedUserState] = useState<User | null>(null);

    const openSearchModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
        setTab(newValue as "chats" | "friends");
    };
    const handleSearch = async () => {
        const users = await fetchUsers(searchQuery);
        setSearchResults(users);

    }
    const handleAddFriend = async (friendId: number) => {
        try {
            const token = getCookie("auth");
            await api.post(`/api/v1/friend/add/${friendId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("친구 요청 보냈습니다!");
        } catch (error) {
            console.error("친구 요청 실패", error);
            alert("요청 실패");
        }
    };
    const handleChangeChat = async (user: User) => {
        const result = await api.get("/api/v1/chat/chat-list", {
            params: {
                name: user.name,
                from: me.current,
            },
        });

        setMessages(result.data.result);

        window.localStorage.setItem("selectedUser", JSON.stringify(user)); //link 객체를 json 형태로 저장해서 새로고침 후에도 창을 그대로 유지 하기 위해
        setSelectedUser(user);
        setSelectedUserState(user);
        setConnectedUsers((prev) => {
            if (prev.find((u) => u.id === user.id)) return prev;
            return [...prev, user];
        });
    };


    useEffect(() => {
        const token = getCookie("auth");
        if (!token) return;

        api.get(`/api/v1/auth/verify-token-id/${token}`).then((res) => {
            setMeId(res.data);  // 서버에서 userId(Long) 반환
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
                {tab === "chats" && selectedUser &&(
                    <ChatList
                        me={me}
                        messages={messages}
                        selectedUser={selectedUser}
                        sendMessage={sendMessage}
                    />
                )}
                {tab === "friends" && (
                    <>
                        <FriendList
                            links={links}
                            setSelectedUser={setSelectedUser}
                            setMessages={setMessages}
                        />
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
                                        handleChangeChat(user); // 친구 추가 없이도 바로 채팅 시작
                                        closeModal();
                                    }}
                                    secondaryAction={
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation(); //친구 추가 클릭 시 채팅 이벤트 막음
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
