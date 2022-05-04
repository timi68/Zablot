import React from "react";
import AppLayout from "../../src/AppLayout";
import { useSnackbar } from "notistack";
import * as Interfaces from "../../lib/interfaces";
import FetchUser from "../../lib/fetch_user";
import axios from "axios";
import { AppContext } from "../../lib/context";
import { NextRouter, useRouter } from "next/router";

export default function PastQuestions(props: { user: string }) {
  const {
    state: { loggedIn, user, socket },
    dispatch,
  } = React.useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const router: NextRouter = useRouter();

  React.useEffect(() => {
    if (!user || !socket || !loggedIn) {
      if (props?.user) {
        FetchUser(dispatch, enqueueSnackbar, props.user, router);
        return;
      }
      axios.get("/logout").then((response) => {
        socket?.disconnect();
      });
      return;
    }
  }, [socket, enqueueSnackbar, dispatch, props, user, loggedIn, router]);

  return <div className="get-coin-wrapper">This is Get Coin Page</div>;
}

export async function getServerSideProps({ req, res }) {
  const user = req.session.user;
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
