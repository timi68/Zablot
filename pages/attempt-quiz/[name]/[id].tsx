import React from "react";
import AppLayout from "@src/AppLayout";
import { useSnackbar } from "notistack";
import * as Interfaces from "@lib/interfaces";
import FetchUser from "@lib/fetch_user";
import axios from "axios";
import { NextRouter, useRouter } from "next/router";
import { Breadcrumbs, Button, Chip, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { CardActionArea } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Link from "next/link";
import { InferGetServerSidePropsType } from "next";
import NavigateNextIcon from "@mui/icons-material/NavigateNextRounded";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";

export default function PastQuestions(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { loggedIn, user, socket } = useAppSelector(
    (state) => state.sessionStore
  );
  const [tab, setTab] = React.useState<number>(0);
  const { enqueueSnackbar } = useSnackbar();
  const router: NextRouter = useRouter();
  const routes = router.route.split("/");
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    !user && FetchUser(dispatch, enqueueSnackbar, props.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
