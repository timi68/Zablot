import { Socket } from "socket.io";
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
  session: {
    USER_ID: null,
    SOCKET_ID: null,
  },
};

const AppContext = createSlice({
  name: "appState",
  initialState,
  reducers: {
    USER: (state: stateInterface, actions: PayloadAction<User>) => {
      state.user = actions.payload;
      state.loggedIn = true;
      return;
    },
    SOCKET: (
      state: stateInterface,
      actions: PayloadAction<{ socket: Socket }>
    ) => {
      state.socket = actions.payload.socket;
    },
    SESSION: (
      state: stateInterface,
      actions: PayloadAction<{ USER_ID: string; SOCKET_ID: string }>
    ) => {
      state.session = actions.payload;
    },
    ACTIVE_FRIENDS: (
      state: stateInterface,
      actions: PayloadAction<string[]>
    ) => {
      state.activeFriends = actions.payload;
    },
  },
});

export const { USER, SESSION, SOCKET, ACTIVE_FRIENDS } = AppContext.actions;
export default AppContext.reducer;
