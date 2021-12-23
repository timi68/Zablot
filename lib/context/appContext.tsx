import React, {useReducer} from "react";
import * as Interface from "../interfaces";

function Reducer(
	state: Interface.stateInterface,
	action: Interface.actionInterface
): Interface.stateInterface {
	return state;
}

const defaultState = {
	LoggedIn: false,
	socket: null,
	user: null,
	mode: "light",
	session: {
		id: null,
		socket_id: null,
	},
};

export const AppContext = React.createContext<Interface.context | null>(null);

function AppContextProvider({children}) {
	const [state, dispatch] = useReducer(Reducer, defaultState);

	const shareProp: Interface.context = {
		state,
		dispatch,
	};
	return (
		<AppContext.Provider value={shareProp}>{children}</AppContext.Provider>
	);
}

export default AppContextProvider;
