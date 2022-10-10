import React, { useReducer, useEffect } from "react";
import { useSocket } from "../socket";
import cookie from "js-cookie";
import AppLayout from "../../src/AppLayout";
import { SnackbarProvider } from "notistack";
import { AnimatePresence } from "framer-motion";
import io from "socket.io-client";
import { SOCKET } from "../redux/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

function AppContextProvider({ children }) {
  const dispatch = useAppDispatch();
  // const loggedIn = useAppSelector((state) => state.sessionStore.loggedIn);
  const socket = useSocket("/", true);

  useEffect(() => {
    dispatch(SOCKET({ socket }));
  }, [dispatch, socket]);

  return (
    <AnimatePresence exitBeforeEnter>
      <SnackbarProvider maxSnack={3} dense>
        <AppLayout>{children}</AppLayout>
      </SnackbarProvider>
    </AnimatePresence>
  );
}

export default AppContextProvider;
