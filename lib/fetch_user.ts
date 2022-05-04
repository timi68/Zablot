/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { SnackbarMessage, OptionsObject, SnackbarKey } from "notistack";
import React from "react";
import { actionInterface, ActionType, User } from "../lib/interfaces";
import { NextRouter } from "next/router";

type enqueueSnackbar = (
  message: SnackbarMessage,
  options?: OptionsObject
) => SnackbarKey;

export default async function (
  dispatch: React.Dispatch<actionInterface>,
  enqueueSnackbar: enqueueSnackbar,
  id: string,
  router: NextRouter
): Promise<boolean | void> {
  try {
    let data: { id: string } = { id: id };
    const request = await axios.post<{ success: boolean; user: any }>(
      "/api/user/details",
      data
    );

    if (!request.data.success) return router.replace("/login");
    let user = await request.data.user;

    user.Notifications = user.Notifications[0].notifications.reverse();
    user.Friends = user.Friends[0].friends;
    user.FriendRequests = user.FriendRequests[0].requests.reverse();
    user.Settings = user.Settings[0].settings;

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
