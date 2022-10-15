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
import AppChatBoard from "@comp/dashboard/chatboard";
import ChatRoom from "@comp/dashboard/chatroom";
import { Users } from "@server/models";
import getUser from "@lib/getUser";
import Coin from "@comp/coin";
import stringToColor from "@utils/stringToColor";

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
          <div className="mobile-header sm:hidden sticky top-0 bg-whitesmoke z-10">
            <div className="flex justify-between p-3">
              <Typography
                variant="h5"
                color="primary"
                className="logo title display-large"
                sx={{
                  fontWeight: 700,
                  fontFamily: "Poppins !important",
                }}
              >
                Zablot
              </Typography>
              <div className="wrap">
                <Coin />
                <IconButton className="open ml-3">
                  <Avatar
                    src={user.Image.profile}
                    sx={{
                      width: 25,
                      height: 25,
                      pt: "1px",
                      fontSize: ".8rem",
                      bgcolor: stringToColor(user.FullName),
                    }}
                  >
                    {user.FullName.split(" ")[0][0] +
                      (user.FullName.split(" ")[1]?.at(0) ?? "")}
                  </Avatar>
                </IconButton>
              </div>
            </div>
            <Divider />
          </div>
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
