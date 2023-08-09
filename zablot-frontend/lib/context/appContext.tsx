import React from "react";
import { useSocket } from "@lib/socket";
import AppLayout from "@comp/layout";
import { SnackbarProvider } from "notistack";
import { AnimatePresence } from "framer-motion";
import { SOCKET } from "@lib/redux/userSlice";
import { useAppDispatch } from "@lib/redux/store";

function AppContextProvider({ children }) {
  const dispatch = useAppDispatch();
  const socket = useSocket("/", true);

  React.useEffect(() => {
    dispatch(SOCKET({ socket }));
  }, [dispatch, socket]);

  return (
    <AnimatePresence mode="wait">
      <SnackbarProvider maxSnack={3} dense>
        <AppLayout>{children}</AppLayout>
      </SnackbarProvider>
    </AnimatePresence>
  );
}

export default AppContextProvider;
