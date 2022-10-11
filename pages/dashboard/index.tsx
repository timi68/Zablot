/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import NoSession from "@comp/nosession";
import { CircularProgress, Container } from "@mui/material";
import { useSnackbar } from "notistack";
import FetchUser from "@lib/fetch_user";
import mongoose from "mongoose";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import UploadScreen from "@comp/dashboard/uploadsection";
import AppChatBoard from "@comp/dashboard/chatboard";
import ChatRoom from "@comp/dashboard/chatroom";

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

  if (socket && user && loggedIn) {
    return (
      <React.Fragment>
        <section className="main-body wide center-content">
          <div className="posts social-feeds informations view-screen">
            <UploadScreen />
          </div>
          <ChatRoom />
        </section>
        <AppChatBoard />
      </React.Fragment>
    );
  } else if (props?.user) {
    return (
      <Container
        sx={{
          width: "100vw",
          height: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress />
        Loading...
      </Container>
    );
  } else {
    return <NoSession />;
  }
};

export async function getServerSideProps({ req, res }) {
  try {
    const user_id = req.session.user;

    if (!user_id) throw new Error("There is no session");

    const user = await mongoose.models.Users.findById(
      new mongoose.Types.ObjectId(user_id),
      {
        All_Logins: 0,
        Online: 0,
        Last_Seen: 0,
        Account_Creation_Date: 0,
        DateOfBirth: 0,
      }
    )
      .populate("FriendRequests")
      .populate("Notifications")
      .populate("Settings")
      .populate("Friends");

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
