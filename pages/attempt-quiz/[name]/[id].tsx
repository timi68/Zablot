import React from "react";
import AppLayout from "../../../src/AppLayout";
import { useSnackbar } from "notistack";
import * as Interfaces from "../../../lib/interfaces";
import FetchUser from "../../../lib/fetch_user";
import axios from "axios";
import { AppContext } from "../../../lib/context";
import { NextRouter, useRouter } from "next/router";
import { Breadcrumbs, Button, Chip, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { CardActionArea } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Link from "next/link";
import { InferGetServerSidePropsType } from "next";
import NavigateNextIcon from "@mui/icons-material/NavigateNextRounded";

export default function PastQuestions(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const {
    state: { user, socket },
    dispatch,
  } = React.useContext(AppContext);
  const [tab, setTab] = React.useState<number>(0);
  const { enqueueSnackbar } = useSnackbar();
  const router: NextRouter = useRouter();
  const routes = router.route.split("/");

  console.log({ router });

  React.useEffect(() => {
    if (!user || !socket) {
      if (props?.user) {
        FetchUser(dispatch, enqueueSnackbar, props.user, router);
        return;
      }
      axios.get("/logout").then((response) => {
        socket?.disconnect();
      });
      return;
    }
  }, [socket, enqueueSnackbar, dispatch, props, user, router]);

  console.log({ user: props.user, params: props.params });

  return (
    <div className="attempt-quiz-wrapper">
      <h1>This is quiz page</h1>
    </div>
  );
}

export async function getServerSideProps({
  req,
  res,
  params,
}: GetServerSidePropsContext<{ exam: string }>): Promise<
  GetServerSidePropsResult<{ user: string; params: { exam: string } }>
> {
  const user = (req as any).session.user;
  console.log({ params });

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: { user, params },
  };
}
