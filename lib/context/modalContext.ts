import React from "react";

type Context = {
	current: HTMLElement;
} | null;

export const ModalContext = React.createContext<Context>(null);
