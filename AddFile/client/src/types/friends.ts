export type FriendRequestListResponse = {
  description: string; // ErrorCode (서버에서 enum이라도 프론트는 string or number)
  UserList: ReceiveRequest[];
  friendRequestList: SendRequest[];
};
export type ReceiveRequest = {
  name: string;
  sendID: number;
  receiveID: number;
  createdAt: string;
};
export type SendRequest = {
  name: string;
  sendID: number;
  receiveID: number;
  createdAt: string;
};
