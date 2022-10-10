import { AppDispatch } from "./redux/store";
import { SnackbarMessage, OptionsObject, SnackbarKey } from "notistack";
import React from "react";
import { User } from "@/lib/interfaces";
import { USER } from "./redux/userSlice";

type enqueueSnackbar = (
  message: SnackbarMessage,
  options?: OptionsObject
) => SnackbarKey;

export default function DispatchUser(
  dispatch: AppDispatch,
  enqueueSnackbar: enqueueSnackbar,
  _user: string
): void {
  try {
    const user = JSON.parse(_user) as any;
    user.Notifications = user.Notifications[0].notifications.reverse();
    user.Friends = user.Friends[0].friends;
    user.FriendRequests = user.FriendRequests[0].requests.reverse();
    user.Settings = user.Settings[0].settings;

    dispatch(USER(user as unknown as User));
  } catch (error) {
    enqueueSnackbar(error.message, {
      variant: "error",
    });
  }
}
