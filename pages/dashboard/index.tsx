/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import NoSession from "@comp/nosession";
import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import FetchUser from "@lib/fetch_user";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import UploadScreen from "@comp/dashboard/uploadsection";
import AppChatBoard from "@comp/global/header/chatboard";
import ChatRoom from "@comp/global/chatroom";
import { Users } from "@server/models";
import getUser from "@lib/getUser";
import Coin from "@comp/coin";
import stringToColor from "@utils/stringToColor";
import { emitCustomEvent } from "react-custom-events";

const Dashboard = (props: { children?: React.ReactNode; user: string }) => {
  const { user, loggedIn, socket } = useAppSelector(
    (state) => state.sessionStore
  );
  const dispatch = useAppDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  React.useEffect(() => {
    !user && FetchUser(dispatch, enqueueSnackbar, props.user);
  }, []);

  React.useEffect(() => {
    if (socket) {
      socket?.on("disconnect", (reason) => {
        console.log("disconnected", reason, socket.id);
      });
    }

    return () => {
      // @ts-ignore
      socket?.off();
    };
  }, [socket]);

  if (!user) return <></>;

  return (
    <React.Fragment>
      <section className="main-body wide center-content">
        <div className="posts social-feeds informations view-screen">
          <UploadScreen />
        </div>
      </section>
    </React.Fragment>
  );
};

export async function getServerSideProps({ req, res }) {
  try {
    const user_id = req.session.user;

    if (!user_id) throw new Error("There is no session");

    const user = await getUser(user_id);
    if (!user) throw new Error("User not found");

    return {
      props: { user: JSON.stringify(user) },
    };
  } catch (error) {
    console.log({ error });
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
}

export default Dashboard;
