import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import UserContext from "./userSlice";
import QuestionActions from "./questionSlice";
import RoomActions, { updateRoom } from "./roomSlice";
import { U } from "@types";

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
  sessionStore: UserContext,
  rooms: RoomActions,
  questions: QuestionActions,
});

export const setupStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itselfs
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = typeof setupStore;
export type AppDispatch = AppStore["dispatch"];

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const UpdateState: U<typeof useAppDispatch> = (
  field,
  dispatch,
  room_id,
  messageId
) => {
  const messages = setupStore
    .getState()
    .rooms.entities[room_id].messages.map((_message) => {
      if (_message._id === messageId) {
        return { ..._message, ...field };
      }
      return _message;
    });

  dispatch(
    updateRoom({
      id: room_id,
      changes: {
        messages,
        type: "in",
      },
    })
  );
};

export default setupStore;
