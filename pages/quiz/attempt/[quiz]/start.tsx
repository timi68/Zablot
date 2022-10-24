import React from "react";
import { useSnackbar } from "notistack";
import * as Interfaces from "@types";
import FetchUser from "@lib/fetch_user";
import axios from "axios";
import { NextRouter, useRouter } from "next/router";
import { Avatar, Breadcrumbs, Button, Chip, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { CardActionArea } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Link from "next/link";
import { InferGetServerSidePropsType } from "next";
import NavigateNextIcon from "@mui/icons-material/NavigateNextRounded";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import getUser from "@lib/getUser";
import { Divider } from "antd";

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
    <div className="start-quiz-wrapper h-full overflow-auto p-3 flex-grow">
      <div className="header mb-3 flex justify-between bg-white rounded-lg shadow-lg p-2">
        <div className="flex items-center gap-3">
          <div className="quiz-title text-lg font-bold">Mathematics</div>—
          <div className="owner text-xs font-medium">by Timi James</div>
        </div>
        <div className="monitor flex gap-3 items-center">
          <span className="time-count text-lg font-bold text-amber-900">
            23:00
          </span>
          <Avatar src="" alt="cam capture" />
        </div>
      </div>
      <div className="flex gap-4 justify-between">
        <div className="question-wrap flex-grow max-w-[600px]">
          <div className="page bg-white p-2 mb-2 rounded-lg font-semibold">
            Question 1
          </div>
          <div className="question text">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo,
            optio sapiente. Praesentium! ?
          </div>
          <Divider />
          <ul className="options-wrap grid gap-2">
            {Array.from(new Array(4)).map((key) => {
              return (
                <motion.li
                  whileHover={{ scale: 1.03, x: 10 }}
                  whileTap={{ scale: 0.9 }}
                  className="form-group list-none"
                  key={key}
                >
                  <Button
                    color="inherit"
                    id={key}
                    className="option font-normal text-xs capitalize bg-lightgrey p-3 rounded-lg w-full justify-start"
                  >
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Explicabo, optio sapiente
                  </Button>
                </motion.li>
              );
            })}
          </ul>
          <div className="button-group my-5">
            <div className="flex justify-between">
              <motion.div
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className="cursor-pointer"
              >
                <Button
                  variant="contained"
                  color="inherit"
                  className="bg-transparent text-green border-green border border-solid text-xs rounded-lg"
                >
                  Previous
                </Button>
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.02, x: -10 }}
                className="cursor-pointer"
              >
                <Button
                  variant="contained"
                  color="inherit"
                  className="bg-green text-white text-xs rounded-lg"
                >
                  Next
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
        <div className="p-3 quiz-board-control bg-lightgrey min-h-[350px] mb-3">
          <ul className="gap-2 flex flex-wrap w-[380px] ">
            {Array.from(new Array(50)).map((_, key) => {
              return (
                <motion.li
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.9 }}
                  className="form-group list-none"
                  key={key}
                >
                  <Button
                    color="inherit"
                    className="bg-white w-[30px] text-xs font-bold p-2 h-max min-w-[30px] rounded-lg shadow-lg"
                  >
                    {key + 1}
                  </Button>
                </motion.li>
              );
            })}
          </ul>
          <motion.div
            whileHover={{ scale: 1.03, y: 5 }}
            whileTap={{ scale: 0.9 }}
            className="my-10"
          >
            <Button
              color="primary"
              variant="contained"
              className="bg-green text-white rounded-lg p-2 w-full"
            >
              Submit & Finish Quiz
            </Button>
          </motion.div>
        </div>
      </div>
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
  try {
    // @ts-ignore
    const user_id = req.session.user;
    if (!user_id) throw new Error("There is no session");

    const user = getUser(user_id);
    if (!user) throw new Error("User not found");

    return {
      props: { user: JSON.stringify(user), params: params as { exam: string } },
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
