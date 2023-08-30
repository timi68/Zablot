import { ObjectId } from "mongodb";
import { Socket } from "socket.io";

declare global {
  namespace Zablot {
    export interface User {
      _id: ObjectId;
      firstName: string;
      lastName: string;
      userName: string;
      gender: string;
      dateOfBirth: string;
      password: string;
      email: string;
      image: {
        profile?: string;
        cover?: string;
      };
      settings: Setting[];
      notifications: Notification[];
      online: boolean;
    }

    export interface Admin extends User {}

    export interface Corporate extends User {}

    export interface Driver extends User {}

    export interface Setting {
      _id: string;
    }

    export interface Notification {
      _id: string;
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

declare module "http" {
  interface IncomingMessage {
    user: Zablot.User;
  }
}

declare module "express-serve-static-core" {
  interface Application {
    io: Socket;
  }
}
