import type { Socket } from "socket.io-client";

// export enum ActionType {
//   SESSION = "SESSION",
//   CLIENTSOCKET = "CLIENTSOCKET",
//   REFRESH = "REFRESH",
//   FETCHED = "FETCHED",
// }

export type stateInterface = {
  [x: string]: any;
  loggedIn?: boolean;
  socket: null | Socket;
  user?: null | Zablot.User;
  mode?: string;
  activeFriends?: string[];
  active: string;
  device: "mobile" | "tablet" | "desktop";
};

export type Notification = {
  name?: string;
  title?: string;
  image?: string | null;
  description?: string;
  createdAt?: string;
  seen?: boolean;
};

export type Friend = {
  _id?: string;
  id: string;
  name: string;
  image: string;
  active?: boolean;
  lastPersonToSendMessage: string;
  unseenMessages: number;
  lastMessage: string;
  isPrivate: boolean;
  time: number;
};

export type Settings = [];

export type Requests = {
  from: string;
  name: string;
  userName: string;
  image: string;
  Date: Date;
  accepted?: boolean;
  rejected?: boolean;
};

export type User = {
  _id: string;
  firstName: string;
  userName: string;
  email: string;
  gender: string;
  image: {
    profile: string;
    cover: string;
  };
  NewUser: string;
  notifications: Notification[];
  friends: Friend[];
  friendRequests: Requests[];
  settings: Settings;
  pendingRequests: string[];
};

export type Option = {
  text: string;
  key: string;
  checked: boolean;
};

export interface Question {
  question: string;
  options: Option[];
  key: string;
}

export interface State {
  questions: Question[];
  update?: number;
  removing?: boolean;
}

export type Matched = {
  _id: string;
  firstName: string;
  userName: string;
  sent?: boolean;
  rejected?: boolean;
  friends?: boolean;
};

export type MessageType = {
  _id: string;
  Format: "Form" | "plain" | "image";
  message: string;
  url: string;
  going: string;
  coming: string;
  filename: string;
  question: string;
  options: Option[];
  date: number;
  answered: Partial<{ text: string; checked: boolean }>;
  coin: number;
  timer: number;
  challenge: boolean;
  noAnswer: boolean;
  file?: File;
  upload?: boolean;
  blobUrl?: string;
};

export type RoomType = {
  room_id: string;
  friend: Friend;
  messages: MessageType[];
  loaded: boolean;
  type?: "in" | "out" | "loaded";
  fetched: boolean;
  closed?: boolean;
};

export type U<T extends (...args: any) => any> = (
  field: Partial<MessageType>,
  dispatch: ReturnType<T>,
  room_id: string | number,
  messageId: string
) => void;

export type Quiz = {
  _id: string;
  title: string;
  description: string;
  range?: string[];
  duration: number[];
  visibility: string;
  owner: {
    name: string;
    _id: string;
    reputation: number;
    image: string;
  };
};

// Quiz Types

export type Counter = {
  [x in "answered" | "not_answered" | "not_viewed"]: string[];
};
