import type { Socket } from "socket.io-client";
import { stateInterface } from "./../interfaces/index";
import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import cookie from "js-cookie";
import { User } from "../interfaces";

const initialState: stateInterface = {
  loggedIn: false,
  socket: null,
  user: null,
  mode: "light",
  active: null,
  device: "mobile",
  session: {
    USER_ID: null,
    SOCKET_ID: null,
  },
};

const AppContext = createSlice({
  name: "appState",
  initialState,
  reducers: {
    USER: (state, actions: PayloadAction<User>) => {
      state.user = actions.payload;
      state.loggedIn = true;

      let w = window.innerWidth;
      state.device = w < 500 ? "mobile" : w < 900 ? "tablet" : "desktop";
    },
    SOCKET: (state, actions: PayloadAction<{ socket: Socket }>) => {
      // @ts-ignore
      state.socket = actions.payload.socket;
    },
    SESSION: (
      state,
      actions: PayloadAction<{ USER_ID: string; SOCKET_ID: string }>
    ) => {
      state.session = actions.payload;
    },
    ACTIVE_FRIENDS: (state, actions: PayloadAction<string[]>) => {
      state.activeFriends = actions.payload;
    },
    RESIZE: (
      state,
      actions: PayloadAction<(typeof initialState)["device"]>
    ) => {
      state.device = actions.payload;
    },
  },
});

export const { USER, SESSION, SOCKET, ACTIVE_FRIENDS, RESIZE } =
  AppContext.actions;
export default AppContext.reducer;
