import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { User } from "@/app/data";
import { Info, Phone, Video } from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";

interface ChatTopbarProps {
  selectedUser?: User | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const TopbarIcons = [{ icon: Phone }, { icon: Video }, { icon: Info }];

export default function ChatTopbar({
  selectedUser,
  setSelectedUser,
}: ChatTopbarProps) {
  const close = (event: any) => {
    window.localStorage.removeItem("selectedUser");
    setSelectedUser(null);
  };

  return (
    <div className="w-full h-20 flex p-4 justify-between items-center border-b">
      {selectedUser && (
        <div className="flex items-center gap-2">
          <Avatar className="flex justify-center items-center">
            <AvatarImage
              alt={selectedUser.name}
              width={6}
              height={6}
              className="w-10 h-10 "
            />
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{selectedUser.name}</span>
          </div>
        </div>
      )}
      <span onClick={close}>
        <CloseIcon />
      </span>
    </div>
  );
}
