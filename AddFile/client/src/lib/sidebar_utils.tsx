// lib/sidebar-utils.ts
import api from "@/lib/axios";
import type { ReceiveRequest } from "@/types/friends";

export const getCookie = (name: string): string | null => {
   if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  return null;
};

export const fetchInitialChatUsers = async (
  setConnectedUsers: React.Dispatch<React.SetStateAction<any[]>>,
  setFriendRequests?:React.Dispatch<React.SetStateAction<ReceiveRequest[]>>
) => {
  const token = getCookie("auth");
  if (!token) return;

  const meRes = await api.get(`/api/v1/auth/verify-token/${token}`);
  const userName = meRes.data;

  const res = await api.get("/api/v1/chat/chat-record", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      name: userName,
    },
  });

  const userList = res.data.name.map((n: string) => ({
    name: n,
    messages: [],
  }));

  setConnectedUsers(userList);

  if (setFriendRequests){
    try{
      const frRes = await api.get("/api/v1/friend/Take-Request-friend",{
        headers: {
          Authorization: `Bearer ${token}`,

        },
      });
      setFriendRequests(frRes.data.UserList);

    }catch (e){
      console.error("친구 요청 로딩  에러")
    }
  }
};
