"use client";

import {useEffect, useMemo, useState} from "react";
import {List, ListItem, ListItemText} from "@mui/material";
import api from "@/lib/axios";
import type {User} from "@/app/data";
import {useChatActions} from "@/context/ChatActionsContext";

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return m ? m[2] : null;
};

type Props = { me?: string | null };

type ChatRoom = {
  id: number;            // 상대 id (없으면 0 폴백)
  name: string;          // 표시용 이름
  lastMessage?: string;  // 옵션
  lastAt?: string;       // 옵션
  unread?: number;       // 옵션
};

export default function ChatRooms({ me }: Props) {
  const { setSelectedUser, setMessages, onChangeChat } = useChatActions();

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const authHeader = useMemo(() => {
    const token = getCookie("auth");
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  }, []);

  // chat-record 불러오기 (users[] 우선, name[] 폴백)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        if (!authHeader) {
          if (mounted) setRooms([]);
          return;
        }

        const res = await api.get("/api/v1/chat/chat-record", {
          headers: authHeader,
          params: me ? { name: me } : undefined, // 구형 스펙 호환
        });

        const data = res.data;
        let next: ChatRoom[] = [];

        if (Array.isArray(data?.users)) {
          // { users: [{id,name,...}] }
          next = data.users.map((u: any) => ({
            id: Number(u.id) || 0,
            name: String(u.name),
            lastMessage: u.lastMessage,
            lastAt: u.lastAt,
            unread: u.unread,
          }));
        } else if (Array.isArray(data)) {
          // 응답이 바로 배열일 수도 있음
          next = data.map((u: any) => ({
            id: Number(u.id) || 0,
            name: String(u.name),
            lastMessage: u.lastMessage,
            lastAt: u.lastAt,
            unread: u.unread,
          }));
        } else if (Array.isArray(data?.name)) {
          // 구형: { name: string[] }
          next = data.name.map((n: string) => ({ id: 0, name: n }));
        }

        if (mounted) setRooms(next);
      } catch (e) {
        console.error("❌ chat-record 실패", e);
        if (mounted) setErr("채팅방을 불러오지 못했습니다.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [authHeader, me]);

  // 이름 클릭 → User 객체로 열기
  const openRoom = async (room: ChatRoom) => {
    const user: User = { id: room.id, name: room.name, messages: [] };

    // 깜빡임 방지: 선택 먼저 + 메시지 비우기
    /*setSelectedUser(user);
    setMessages([]);*/

    // 필요하면 여기서 미리 대화 로드 (id 우선, name 폴백)
    // try {
    //   if (authHeader) {
    //     const params = room.id ? { peerId: room.id } : { name: room.name, from: me ?? "" };
    //     const res = await api.get("/api/v1/chat/chat-list", { headers: authHeader, params });
    //     setMessages(res.data?.result ?? []);
    //   }
    // } catch (e) {
    //   console.error("❌ chat-list 실패", e);
    //   setMessages([]);
    // }

    onChangeChat(user); // 소켓 구독/추가 fetch 등 기존 로직
  };

  if (loading) return <div className="p-3 text-sm text-gray-500">불러오는 중…</div>;
  if (err) return <div className="p-3 text-sm text-red-500">{err}</div>;

  if (rooms.length === 0) {
    return (
      <List>
        <ListItem><ListItemText primary="대화방이 없습니다." /></ListItem>
      </List>
    );
  }

  return (
    <List>
      {rooms.map((r) => (
        <ListItem key={`${r.id}-${r.name}`} component="button" onClick={() => openRoom(r)}>
          <ListItemText primary={r.name} />
        </ListItem>
      ))}
    </List>
  );
}
