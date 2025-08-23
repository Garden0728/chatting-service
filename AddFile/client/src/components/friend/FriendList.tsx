"use client";

import {User, Message} from "@/app/data";
import {useCallback, useEffect, useRef, useState} from "react";
import api from "@/lib/axios";
import * as StompJs from "@stomp/stompjs";
import {useChatActions} from "@/context/ChatActionsContext";

interface FriendListProps {
    onChangeChat: (user: User) => void;
}


export default function FriendList() {
    const { onChangeChat } = useChatActions();
    const [friendList, setFriendList] = useState<User[]>([]);
    const [meId, setMeId] = useState<number | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const clientRef = useRef<StompJs.Client | null>(null);
    const getCookie = (name: string): string | null => {
        if (typeof document === "undefined") {
            return null;
        }
        const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
        return match ? match[2] : null;
    };
    useEffect(() => {
        setToken(getCookie("auth"));
    }, []);
    useEffect(() => {


        if (!token) return;

        api.get(`/api/v1/auth/verify-token-id/${token}`).then((res) => {
            setMeId(res.data);  // 서버에서 userId(Long) 반환
        });
    }, [token]);

    useEffect(() => {
        refetch(); //
    }, [token]); //처음 로드 요청 리스트
    const refetch = useCallback(async () => {
        if (!token) return;

        api.get("/api/v1/friend/Take-FriendList", {
            headers: {Authorization: `Bearer ${token}`},
        }).then((res) => {
            console.log("친구 목록 응답:", res.data);
            setFriendList(res.data.FriendList ?? []); //
        }).catch((err) => {
            console.error("친구 목록 응답 에러:", err);
        });
    }, [token]);

    useEffect(() => {
        if (!meId) return;

        const c = new StompJs.Client({
            brokerURL: "ws://localhost:7002/ws-stomp",
            reconnectDelay: 5000,
            connectHeaders: token ? {Authorization: `Bearer ${token}`} : {},
        });


        c.onConnect = () => {
            c.subscribe(`/sub/friend/add${meId}`, (message) => {
                alert("새로운 친구가 등록되었습니다.");
                refetch();
            });

        };
        c.activate();
        clientRef.current = c;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate(); // Promise지만 무시하고 호출
            }

        };

    }, [meId, token]);


    return (
        <div className="p-2">
            <p className="text-lg font-semibold mb-2">친구 목록</p>
            <div className="max-h-64 overflow-y-scroll  pr-2">
                {(friendList ?? []).length == 0 ? (
                    <p className="text-zinc-400">친구 없음</p>
                ) : (
                    friendList.map((friend) => (
                        <div
                            key={friend.id}
                            className="p-2 cursor-pointer hover:underline hover:underline-offset-4 hover:text-black-400 transition-colors"
                            onClick={() => onChangeChat(friend)}
                        >
                            {friend.name}
                        </div>

                    ))
                )}
            </div>
        </div>
    );
}
