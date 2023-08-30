import React from "react";
import { useSocket } from "@lib/socket";
import AppLayout from "@comp/Layout";
import { SnackbarProvider } from "notistack";
import { AnimatePresence } from "framer-motion";
import { SOCKET } from "@lib/redux/userSlice";
import { useAppDispatch } from "@lib/redux/store";

function AppContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <SnackbarProvider maxSnack={3} dense>
        <AppLayout>{children}</AppLayout>
      </SnackbarProvider>
    </AnimatePresence>
  );
}

export default AppContextProvider;
