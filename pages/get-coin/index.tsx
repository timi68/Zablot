import React from "react";
import AppLayout from "@src/AppLayout";
import { useSnackbar } from "notistack";
import * as Interfaces from "@lib/interfaces";
import FetchUser from "@lib/fetch_user";
import axios from "axios";
import { NextRouter, useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import getUser from "@lib/getUser";

export default function PastQuestions(props: { user: string }) {
  const { loggedIn, user, socket } = useAppSelector(
    (state) => state.sessionStore
  );
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const router: NextRouter = useRouter();

  React.useEffect(() => {
    !user && FetchUser(dispatch, enqueueSnackbar, props.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="get-coin-wrapper">This is Get Coin Page</div>;
}

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
