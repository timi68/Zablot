import { Socket } from "socket.io-client";

export enum ActionType {
  LOGGEDIN = "LOGGEDIN",
  SESSION = "SESSION",
  CLIENTSOCKET = "CLIENTSOCKET",
  REFRESH = "REFRESH",
  FETCHED = "FETCHED",
  ACTIVEFRIENDS = "ACTIVEFRIENDS",
  UPDATEFRIENDS = "UPDATEFRIENDS",
}

export interface stateInterface {
  loggedIn?: boolean;
  socket?: null | Socket;
  user?: null | User;
  mode?: string;
  session?: Session;
  activeFriends?: string[];
  active: string;
}

export interface actionInterface {
  type: ActionType;
  payload: object;
}

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

export type Friends = {
  _id?: string;
  Id: string;
  Name: string;
  Image: string;
  active?: boolean;
  LastPersonToSendMessage: string;
  UnseenMessages: number;
  Last_Message: string;
  IsPrivate: boolean;
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
  Friends: Friends[];
  FriendRequests: Requests[];
  Settings: Settings;
  PendingRequests: string[];
};

export interface context {
  state: stateInterface;
  dispatch: React.Dispatch<actionInterface>;
}

export type Session = {
  id: string;
  socket_id: string;
};

export interface Handle {
  setQuestions?(newQuestions: Question, questionId?: number): void;
  updateQuestions?(questionid: number, questiondetails: Question): void;
  setOpen?(questions?: Question[]): void;
  setQuestionToEdit?(questionid: number, questiondetails?: Question): void;
}

export type Option = {
  text: string;
  isNew?: boolean;
  checked: boolean;
};

export interface Question {
  question: string;
  options: Option[];
}

export interface CreatedQuestionInterface {
  edit: { current: Handle };
  ref: React.ForwardedRef<any>;
  upload: { current: Handle };
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

export type Ref = { current: { UpdateFriends(friend: Friends): void } };
export type AppChatBoardType = {
  UpdateFriends(friend: Friends): void;
  SetLastMessage(id: string, message: string, flow: string): void;
  toggle(): void;
  getModalState(): boolean;
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
  options: {
    text: string;
    checked: boolean;
  }[];
  date: Date;
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
  user: Friends;
  messages: MessageType[];
  loaded: boolean;
  pollToggled?: boolean;
  pollData?: MessageType;
  target: HTMLElement;
};

export type RoomProps = {
  ref: React.RefObject<{ getProps(): RoomType } | null>[];
  roomData: RoomType;
  setRooms: React.Dispatch<React.SetStateAction<RoomType[]>>;
  roomsRef: React.RefObject<{ getProps(): RoomType } | null>[];
  index: number;
  chatBoard: React.RefObject<AppChatBoardType>;
};

export type RoomBodyRefType = {
  setMessages(message: MessageType, type: "out" | "in" | "loaded"): void;
  getMessages(): MessageType[];
};
