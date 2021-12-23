import {Socket} from "socket.io-client";

export interface stateInterface {
	LoggedIn?: boolean;
	socket?: null | Socket;
	user?: null | User;
	mode?: string;
	session: Session;
}

export interface actionInterface {
	type: String;
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

export type Requests = [
	{
		From: string;
		Name: string;
		UserName: string;
		Image: string;
		Date: string;
	}
];

export type User = {
	FullName: string;
	UserName: string;
	Email: string;
	Gender: string;
	Image: object;
	NewUser: string;
	Notifications: Notifications;
	Friends: Friends[];
	FriendRequests: Requests;
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
