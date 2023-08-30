import type { Socket } from "socket.io-client";
import { stateInterface } from "./../interfaces/index";
import { createSlice, nanoid, PayloadAction, Slice } from "@reduxjs/toolkit";
import cookie from "js-cookie";
import { User } from "../interfaces";

const initialState: stateInterface = {
  loggedIn: false,
  socket: null,
  user: null,
  mode: "light",
  active: "",
  device: "mobile",
  session: {
    USER_ID: null,
    SOCKET_ID: null,
  },
};

const AppContext: Slice<stateInterface> = createSlice({
  name: "appState",
  initialState,
  reducers: {
    USER: (state, actions: PayloadAction<Zablot.User>) => {
      state.user = actions.payload;
      state.loggedIn = true;

      let w = 1000;

      if (typeof window != "undefined") {
        w = window ? window.innerWidth : 1000;
      }

      state.device = w < 500 ? "mobile" : w < 900 ? "tablet" : "desktop";
    },
    SIGN_OUT: (state) => {
      state.user = null;
      state.loggedIn = false;
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

export const { USER, SESSION, SOCKET, ACTIVE_FRIENDS, RESIZE, SIGN_OUT } =
  AppContext.actions;
export default AppContext.reducer;
