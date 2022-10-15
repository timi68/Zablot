import { RootState, useAppDispatch } from "./store";
import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import cookie from "js-cookie";
import { MessageType, RoomType } from "@types";
import store from "@lib/redux/store";

const roomsAdapter = createEntityAdapter<RoomType>({
  selectId: (room) => room.room_id,
  // Keep the "all IDs" array sorted based on rooms titles
  // sortComparer: (a, b) => a.title.localeCompare(b.title),
});

const roomsSlice = createSlice({
  name: "appState",
  initialState: roomsAdapter.getInitialState({
    loading: "idle",
  }),
  reducers: {
    // @ts-ignore
    addRoom: roomsAdapter.addOne,
    updateRoom: (state, actions) => {
      console.log({ actions });
      // @ts-ignore
      roomsAdapter.updateOne(state, actions);
    },
    // @ts-ignore
    removeRoom: roomsAdapter.removeOne,
  },
});

export const { addRoom, updateRoom, removeRoom } = roomsSlice.actions;
export const {
  selectAll: getRooms,
  selectIds: getRoomIds,
  selectById: getRoom,
} = roomsAdapter.getSelectors<RootState>((state) => state.rooms);

export function getMessage(
  state: RootState,
  room_id: string | number,
  message_id: string
) {
  const { messages, friend } = getRoom(state, room_id);

  let type: "in" | "out";
  let message: MessageType, i: number, pre: Date | null, next: boolean;

  messages.every((m, index) => {
    if (m._id === message_id) {
      i = index;
      message = m;
      pre = i ? new Date(messages[i - 1].date) : null;
      next = Boolean(messages[i + 1]?._id);
      type = m.coming == friend.Id ? "in" : "out";
      return false;
    }

    return true;
  });

  return {
    message,
    pre,
    next,
    type,
    i,
  };
}

export default roomsSlice.reducer;
