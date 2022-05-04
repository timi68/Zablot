import React, { useReducer, useEffect } from "react";
import * as Interface from "../interfaces";
import { useSocket } from "../socket";
import cookie from "js-cookie";
import AppLayout from "../../src/AppLayout";
import { SnackbarProvider } from "notistack";
import { AnimatePresence } from "framer-motion";

function Reducer(
  state: Interface.stateInterface,
  action: Interface.actionInterface
): Interface.stateInterface {
  console.log({ action });
  switch (action.type) {
    case "LOGGEDIN":
    case "SESSION":
    case "CLIENTSOCKET":
    case "FETCHED":
    case "ACTIVEFRIENDS":
      console.log({ action });
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

const defaultState = {
  loggedIn: false,
  socket: null,
  user: null,
  mode: "light",
  active: null,
  session: {
    id: cookie.get("user") ?? null,
    socket_id: null,
  },
};

export const AppContext = React.createContext<Interface.context | null>(null);

function AppContextProvider({ children }) {
  const [state, dispatch] = useReducer(Reducer, defaultState);
  const socket = useSocket("/", state.loggedIn);

  useEffect(() => {
    console.log("from here");
    if (socket) {
      dispatch({
        type: Interface.ActionType.CLIENTSOCKET,
        payload: { socket },
      });
    }
  }, [socket]);

  useEffect(() => {
    console.log({ state });
  });

  console.log("This is new state", state);
  const shareProp: Interface.context = {
    state,
    dispatch,
  };
  return (
    <AppContext.Provider value={shareProp}>
      <AnimatePresence exitBeforeEnter>
        <SnackbarProvider maxSnack={3} dense>
          <AppLayout>{children}</AppLayout>
        </SnackbarProvider>
      </AnimatePresence>
    </AppContext.Provider>
  );
}

export default AppContextProvider;
