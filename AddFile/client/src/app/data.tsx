// export const userData = [];

export const loggedInUserData = {
  id: 5,
  avatar: "/LoggedInUser.jpg",
  name: "Jakob Hoeg",
};

export type LoggedInUserData = typeof loggedInUserData;

export interface Message {
  to: string;
  from: string;
  message: string;
}

export type User = {
  id: number;
  messages: Message[];
  name: string;
};
