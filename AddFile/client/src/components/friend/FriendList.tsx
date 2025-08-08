"use client";

import {User, Message} from "@/app/data";
import {useEffect, useState} from "react";
import api from "@/lib/axios";
import * as StompJs from "@stomp/stompjs";

interface FriendListProps {
    onChangeChat: (user: User) => void;
}


export default function FriendList({onChangeChat}: FriendListProps) {
    const [friendList, setFriendList] = useState<User[]>([]);
    const [meId, setMeId] = useState<number | null>(null);


    const getCookie = (name: string): string | null => {
        if (typeof document === "undefined") {
            return null;
        }
        const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
        return match ? match[2] : null;
    };
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const token = getCookie("auth");
        if (!token) return;

        api.get(`/api/v1/auth/verify-token-id/${token}`).then((res) => {
            setMeId(res.data);  // 서버에서 userId(Long) 반환
        });
    }, []);

    useEffect(() => {
        const token = getCookie("auth");

        if (!token) return;

        api.get("/api/v1/friend/Take-FriendList", {
            headers: {Authorization: `Bearer ${token}`},
        }).then((res) => {
            console.log("친구 목록 응답:", res.data);
            setFriendList(res.data.FriendList); //
        }).catch((err) => {
            console.error("친구 목록 응답 에러:", err);
        });
    }, []);
    return (
        <div className="p-2">
            <p className="text-lg font-semibold mb-2">친구 목록</p>
            {(friendList ?? []).length == 0 ? (
                <p className="text-zinc-400">친구 없음</p>
            ) : (
                friendList.map((friend) => (
                    <div
                        key={friend.id}
                        className="p-2 hover:bg-zinc-800 rounded cursor-pointer"
                        onClick={() => onChangeChat(friend)}
                    >
                        {friend.name}
                    </div>

                ))
            )}
        </div>
    );
}
