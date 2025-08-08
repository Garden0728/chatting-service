"use client";
import {useEffect, useState, useRef} from "react";
import api from "@/lib/axios";
import * as StompJs from "@stomp/stompjs";
import type {ReceiveRequest} from "@/types/friends";




export default function FriendRequests() {
    const [friendRequests, setFriendRequests] = useState<ReceiveRequest[]>([]);
    const clientRef = useRef<StompJs.Client | null>(null);
    const [meId, setMeId] = useState<number | null>(null);

    const getCookie = (name: string): string | null => {
        const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
        return match ? match[2] : null;
    };
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

        api.get("/api/v1/friend/Take-Request-friend", {
            headers: {Authorization: `Bearer ${token}`},
        }).then((res) => setFriendRequests(res.data.UserList));
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

    }, [meId]);

    return (
        <div className="p-2">
            <p className="text-sm font-semibold mb-2">받은 친구 요청</p>
            <ul className="space-y-1">
                {friendRequests.map((req) => (
                    <li key={req.sendID} className="bg-muted rounded px-3 py-2 flex justify-between items-center">
                        <span>{req.name}</span>
                        <div className="flex space-x-1">
                            <button className="text-green-500 text-sm hover:underline">수락</button>
                            <button className="text-red-500 text-sm hover:underline">거절</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
