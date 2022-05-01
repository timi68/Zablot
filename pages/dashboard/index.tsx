/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import AppLayout from "../../src/AppLayout";
import { AppContext } from "../../lib/context/appContext";
import { ActionType, Friends } from "../../lib/interfaces";
import DashboardComponent from "../../components/dashboard";
import axios from "axios";
import NoSession from "../../components/nosession";
import { CircularProgress, Container } from "@mui/material";
import { useSnackbar } from "notistack";
import FetchUser from "../../lib/fetch_user";

const Dashboard = React.forwardRef(function (
  props: { children?: React.ReactNode; user: string },
  ref
) {
  const {
    state: { user, socket, loggedIn },
    dispatch,
  } = React.useContext(AppContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [error, setError] = React.useState(null);
  const DashboardComponentRef = React.useRef(null);

  React.useImperativeHandle(
    ref,
    () => ({
      UpdateFriends(friend: Friends) {
        DashboardComponentRef.current.UpdateFriends(friend);
      },
    }),
    []
  );

  const handleJoined = React.useCallback(
    (id) => {
      console.log(id);
      const SOCKET_ID = id;
      const session = {
        USERID: user?._id,
        SOCKET_ID,
      };

      dispatch({
        type: ActionType.SESSION,
        payload: {
          session: {
            id: user?._id,
            socket_id: id,
          },
        },
      });

      socket?.emit("ADD_JOINED_REQUEST", session, (err, done) => {
        console.log(err || done);
      });
    },
    [socket]
  );

  React.useEffect(() => {
    if (!user || !socket || !loggedIn) {
      if (props?.user) {
        FetchUser(dispatch, enqueueSnackbar, props.user);
        return;
      }
      axios.get("/logout").then((response) => {
        socket?.disconnect();
      });
      return;
    }

    if (socket) {
      socket?.on("userid", handleJoined);
      socket?.on("disconnect", () => {
        console.log("disconnected");
      });
    }

    return () => {
      socket?.off();
    };
  }, [socket]);

  if (socket && user && loggedIn) {
    return (
      <AppLayout
        loggedIn={true}
        title="dashboard"
        chatboardRef={DashboardComponentRef}
      >
        <DashboardComponent ref={DashboardComponentRef} />
      </AppLayout>
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
});

Dashboard.displayName = "Dashboard";

export async function getServerSideProps({ req, res }) {
  const user = req.session.user;

  console.log("this is user", user);
  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }

  return {
    props: { user },
  };
}

export default Dashboard;
