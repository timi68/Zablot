/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSnackbar } from "notistack";
import FetchUser from "@lib/fetch_user";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import UploadScreen from "@comp/dashboard/uploadsection";
import getUser from "@lib/getUser";

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
    const user_id = req.session.passport.user._id ?? req.session.user;
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
