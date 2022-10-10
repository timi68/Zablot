import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import UserContext from "./userSlice";
import RoomActions from "./roomSlice";

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
  sessionStore: UserContext,
  rooms: RoomActions,
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

export default setupStore;
