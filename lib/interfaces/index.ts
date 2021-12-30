import {Socket} from "socket.io-client";

export enum ActionType {
	LOGGEDIN = "LOGGEDIN",
	SESSION = "SESSION",
	CLIENTSOCKET = "CLIENTSOCKET",
	REFRESH = "REFRESH",
	FETCHED = "FETCHED",
	ACTIVEFRIENDS = "ACTIVEFRIENDS",
}

export interface stateInterface {
	loggedIn?: boolean;
	socket?: null | Socket;
	user?: null | User;
	mode?: string;
	session?: Session;
	activeFriends?: string[];
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
	_id: string;
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
	edit: {current: Handle};
	ref: React.ForwardedRef<any>;
	upload: {current: Handle};
}

export interface State {
	questions: Question[];
	update?: number;
	removing?: boolean;
}
