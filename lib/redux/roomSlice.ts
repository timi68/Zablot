import { RootState } from "./store";
import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import cookie from "js-cookie";
import { RoomType } from "../interfaces";

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
    // @ts-ignore
    updateRoom: roomsAdapter.updateOne,
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
export default roomsSlice.reducer;
