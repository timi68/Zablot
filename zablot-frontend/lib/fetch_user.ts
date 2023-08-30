import { AppDispatch } from "./redux/store";
import { SnackbarMessage, OptionsObject, SnackbarKey } from "notistack";
import React from "react";
import { User } from "@lib/interfaces";
import { USER } from "./redux/userSlice";

type enqueueSnackbar = (
  message: SnackbarMessage,
  options?: OptionsObject
) => SnackbarKey;

export default function DispatchUser(
  dispatch: AppDispatch,
  enqueueSnackbar: enqueueSnackbar,
  user: Zablot.User
): void {
  dispatch(USER(user));
}
