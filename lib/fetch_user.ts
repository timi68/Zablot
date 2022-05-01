/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { SnackbarMessage, OptionsObject, SnackbarKey } from "notistack";
import React from "react";
import { actionInterface, ActionType } from "../lib/interfaces";

type enqueueSnackbar = (
  message: SnackbarMessage,
  options?: OptionsObject
) => SnackbarKey;

export default async function (
  dispatch: React.Dispatch<actionInterface>,
  enqueueSnackbar: enqueueSnackbar,
  id: string
): Promise<void> {
  try {
    let data: { id: string } = { id: id };
    const request = await axios.post("/api/user/details", data);
    let user = await request.data;

    user.Notifications = user.Notifications[0].notifications.reverse();
    user.Friends = user.Friends[0].friends;
    user.FriendRequests = user.FriendRequests[0].requests.reverse();
    user.Settings = user.Settings[0].settings;

    console.log("this is from room", user);

    dispatch({
      type: ActionType.FETCHED,
      payload: {
        user,
        loggedIn: true,
      },
    });
  } catch (error) {
    enqueueSnackbar(error.message, {
      variant: "error",
    });
  }
}
