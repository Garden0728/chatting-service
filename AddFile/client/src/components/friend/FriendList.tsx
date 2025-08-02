"use client";

import { User, Message } from "@/app/data";

interface FriendListProps {
  links: User[];
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function FriendList({ links, setSelectedUser }: FriendListProps) {
  return (
    <div className="p-2">
      <p className="text-lg font-semibold mb-2">친구 목록</p>
      {links.map((friend) => (
        <div
          key={friend.id}
          className="p-2 hover:bg-zinc-800 rounded cursor-pointer"
          onClick={() => setSelectedUser(friend)}
        >
          {friend.name}
        </div>
      ))}
    </div>
  );
}
