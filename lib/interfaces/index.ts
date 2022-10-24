import type { Socket } from "socket.io";

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
  user?: null | User;
  mode?: string;
  activeFriends?: string[];
  active: string;
  device: "mobile" | "tablet" | "desktop";
};

export type Notifications = [
  {
    Name?: string;
    Title?: string;
    Image?: string | null;
    Description?: string;
    Date?: Date;
    Seen?: boolean;
  }
];

export type Friend = {
  _id?: string;
  Id: string;
  Name: string;
  Image: string;
  active?: boolean;
  LastPersonToSendMessage: string;
  UnseenMessages: number;
  Last_Message: string;
  IsPrivate: boolean;
  time: number;
};

export type Settings = [];

export type Requests = {
  From: string;
  Name: string;
  UserName: string;
  Image: string;
  Date: Date;
  Accepted?: boolean;
  Rejected?: boolean;
};

export type User = {
  _id: string;
  FullName: string;
  UserName: string;
  Email: string;
  Gender: string;
  Image: {
    profile: string;
    cover: string;
  };
  NewUser: string;
  Notifications: Notifications;
  Friends: Friend[];
  FriendRequests: Requests[];
  Settings: Settings;
  PendingRequests: string[];
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
  FullName: string;
  UserName: string;
  sent?: boolean;
  rejected?: boolean;
  friends?: boolean;
};

export type MessageType = Partial<{
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
}>;

export type RoomType = {
  room_id: string;
  friend: Friend;
  messages: MessageType[];
  loaded: boolean;
  pollToggled?: boolean;
  pollData?: MessageType;
  target: HTMLElement;
  type?: "in" | "out" | "loaded";
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
