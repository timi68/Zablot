import type { Socket } from "socket.io";

export enum ActionType {
  SESSION = "SESSION",
  CLIENTSOCKET = "CLIENTSOCKET",
  REFRESH = "REFRESH",
  FETCHED = "FETCHED",
}

export type stateInterface = {
  [x: string]: any;
  loggedIn?: boolean;
  socket: null | Socket;
  user?: null | User;
  mode?: string;
  session?: Session;
  activeFriends?: string[];
  active: string;
};
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

export interface context {
  state: { socket: Socket | null };
  dispatch: React.Dispatch<actionInterface>;
}

export type Session = {
  USER_ID: string;
  SOCKET_ID: string;
};

export interface Handle {
  setQuestions?(newQuestions: Question, questionId?: number): void;
  updateQuestions?(question_id: number, question_details: Question): void;
  setOpen?(questions?: Question[]): void;
  setQuestionToEdit?(question_id: number, question_details?: Question): void;
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

export type Ref = { current: { UpdateFriends(friend: Friend): void } };
export type AppChatBoardType = {
  UpdateFriends(friend: Friend): void;
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
  room_id: string;
  user: Friend;
  messages: MessageType[];
  loaded: boolean;
  pollToggled?: boolean;
  pollData?: MessageType;
  target: HTMLElement;
  type?: "in" | "out" | "loaded";
};

export type RoomProps = {
  ref: React.RefObject<{ getProps(): RoomType } | null>[];
  roomData: RoomType;
  setRooms: React.Dispatch<React.SetStateAction<RoomType[]>>;
  roomsRef: React.RefObject<{ getProps(): RoomType } | null>[];
  index: number;
};

export type RoomBodyRefType = {
  setMessages(message: MessageType, type: "out" | "in" | "loaded"): void;
  getMessages(): MessageType[];
};
