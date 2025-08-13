"use client";
import {useEffect, useState, useRef, useCallback} from "react";
import api from "@/lib/axios";
import * as StompJs from "@stomp/stompjs";
import type {ReceiveRequest} from "@/types/friends";


export default function FriendRequests() {
    const [friendRequests, setFriendRequests] = useState<ReceiveRequest[]>([]);
    const clientRef = useRef<StompJs.Client | null>(null);
    const [meId, setMeId] = useState<number | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const getCookie = (name: string): string | null => {
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

    const refetch = useCallback(async () => {
        if (!token) return;
        const res = await api.get("/api/v1/friend/Take-Request-friend", {
            headers: {Authorization: `Bearer ${token}`},
        });
        setFriendRequests(res.data.UserList ?? []);
    }, [token]);

    useEffect(() => {
        refetch(); //
    }, [token]); //처음 로드 요청 리스트
    const accept = useCallback(async (friendId: number) => {
        try {
            await api.put(`/api/v1/friend/accept/${friendId}`, null, {
                headers: {Authorization: `Bearer ${token}`},
            });
            alert("친구요청이 수락되었습니다!");
            await refetch();
        } catch {
            alert("수락 실패");
        }
    }, [token, refetch]);


    useEffect(() => {
        if (!meId) return;

        const c = new StompJs.Client({
            brokerURL: "ws://localhost:7002/ws-stomp",
            reconnectDelay: 5000,
            connectHeaders: token ? {Authorization: `Bearer ${token}`} : {},
        });

        c.onConnect = () => {
            c.subscribe(`/sub/friend/${meId}`, (message) => {
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
            <p className="text-sm font-semibold mb-2">받은 친구 요청</p>
            <ul className="space-y-1">
                {friendRequests.map((req) => (
                    <li
                        key={req.id}
                        className="bg-muted rounded px-3 py-2 flex justify-between items-center"
                    >
                        <span>{req.name}</span>
                        <div className="flex space-x-2">
                            {/* ⚠️ 여기서 'req.friendId'가 진짜 요청 PK여야 함 */}
                            <button
                                className="text-green-600 text-sm hover:underline"
                                onClick={() => accept(req.id)}
                            >
                                수락
                            </button>
                            <button
                                className="text-red-600 text-sm hover:underline"
                                //onClick={() => reject((req as any).friendId)}
                            >
                                거절
                            </button>
                        </div>
                    </li>
                ))}
                {friendRequests.length === 0 && (
                    <li className="text-xs text-muted-foreground">요청이 없습니다.</li>
                )}
            </ul>
        </div>
    );
}
