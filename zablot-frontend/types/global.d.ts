import { Socket } from "socket.io";
import { Friend, Requests } from "@lib/interfaces/index";

declare global {
  namespace Zablot {
    export interface User {
      _id: string;
      firstName: string;
      lastName: string;
      userName: string;
      gender?: string;
      dateOfBirth?: string;
      email: string;
      image: {
        profile?: string;
        cover?: string;
      };
      friends: Friend[];
      friendRequests: Requests[];
      pendingRequests: string[];
      settings: Setting[];
      notifications: Notification[];
      online: boolean;
      coins: number;
      provider: string;
      verified: boolean;
      createdAt: string;
      lastSeen: string;
    }

    export type Friend = {
      _id: string;
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

    export type Requests = {
      from: string;
      name: string;
      userName: string;
      image: string;
      Date: Date;
      accepted?: boolean;
      rejected?: boolean;
    };

    export interface Setting {
      _id: string;
    }

    export interface Notification {
      _id: string;
      name: string;
      title: string;
      image: string | null;
      description: string;
      createdAt: string;
      seen: boolean;
    }

    export interface Message {
      _id: ObjectId;
      text: String;
      going: String;
      coming: String;
      date: Date;
      seen: Boolean;
      delivered: Boolean;
    }
  }
}
