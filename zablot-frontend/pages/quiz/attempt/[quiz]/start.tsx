import React from "react";
import { useSnackbar } from "notistack";
import { Counter, Question } from "@types";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { NextRouter, useRouter } from "next/router";
import { GetServerSidePropsContext, GetServerSidePropsResult, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import getUser from "@lib/getUser";
import { Questions } from "@lib/questions";
import lodash from "lodash";
import Cookies from "js-cookie";
import moment from "moment";
import BoardControl from "@comp/quiz/attempt/boardControl";
import FetchUser from "@lib/fetch_user";
import { Modal } from "antd";
import { Avatar, Button, Card, Stack, CardActionArea, Tooltip } from "@mui/material";
import AttemptQuestion from "@comp/quiz/attemptQuestion";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { getServerSideProps } from "pages/dashboard";

export default function PastQuestions(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const user = useAppSelector((state) => state.sessionStore.user);
  const [page, setPage] = React.useState<number>(0);
  const { enqueueSnackbar } = useSnackbar();
  const router: NextRouter = useRouter();
  const dispatch = useAppDispatch();
  const [questions, setQuestions] = React.useState<Question[]>(
    Questions ?? (JSON.parse(Cookies.get("attempting") ?? "[]") as Question[])
  );
  const [counter, setCounter] = React.useState<Counter>({
    answered: [],
    not_answered: questions.map((q) => q.key),
    not_viewed: questions.map((q) => q.key),
  });

  React.useEffect(() => {
    !user && FetchUser(dispatch, enqueueSnackbar, props.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    let s = new Set(counter.answered);
    let n = new Set(counter.not_answered);

    let key = questions[page].key;
    let answered = questions[page].options.some((opt) => opt.checked);
    let not_answered = answered
      ? lodash.pull(counter.not_answered, key)
      : Array.from(n.add(key));
    let not_viewed = lodash.pull(counter.not_viewed, key);

    setCounter({
      answered: answered
        ? Array.from<string>(s.add(key))
        : lodash.pull(counter.answered, key),
      not_answered,
      not_viewed,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, questions]);

  React.useEffect(() => {
    Cookies.remove("attempting");
    Cookies.set("attempting", JSON.stringify(questions), {
      expires: moment().add(2, "hours").toDate(),
    });
  }, [questions]);

  const Finish = () => {
    console.log(questions);
  };

  const handleBack = () => {
    const { destroy } = Modal.confirm({
      title: (
        <span className="flex gap-3 items-center">
          <span>Confirm</span>
        </span>
      ),
      okText: "Save & Navigate",
      cancelText: "Navigate",
      onOk: () => {
        destroy();
        router.back();
      },
      onCancel: () => {
        Cookies.remove("questions");
        router.back();
      },
    });
  };

  if (!user) return <></>;

  return (
    <div className="start-quiz-wrapper h-full overflow-auto p-3 flex-grow">
      <div className="header mb-3 flex gap-3 items-center justify-between bg-white rounded-lg shadow-lg p-2">
        <Tooltip title="Go back to previous page" placement="bottom">
          <motion.div
            whileHover={{ scale: 0.9 }}
            className="relative bg-green h-[30px] w-[30px] rounded-3xl"
          >
            <motion.button
              onClick={() => handleBack()}
              whileHover={{ x: -10 }}
              whileTap={{ x: -20 }}
              className="bg-transparent"
            >
              <KeyboardBackspaceRoundedIcon
                fontSize="large"
                className="ml-[5px] mt-[-2px] text-white"
              />
            </motion.button>
          </motion.div>
        </Tooltip>
        <div className="flex flex-grow items-center gap-3">
          <div className="quiz-title text-lg font-bold">Mathematics</div>—
          <div className="owner text-xs font-medium">by Timi James</div>
        </div>
        <div className="monitor flex gap-3 items-center">
          <Avatar variant="rounded" src="" alt="cam capture" />
        </div>
      </div>
      <div className="sm:flex gap-4 justify-between">
        <div className="question-wrap flex-grow max-w-[600px">
          <AnimatePresence>
            <AttemptQuestion
              questions={questions}
              page={page}
              setQuestions={setQuestions}
            />
          </AnimatePresence>
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
                  className="disabled:invisible bg-transparent text-green border-green border border-solid text-xs rounded-lg"
                  onClick={() => setPage(page - 1)}
                  disabled={!page}
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
                  className="bg-green text-white text-xs rounded-lg disabled:invisible"
                  onClick={() =>
                    page === Questions.length - 1 ? Finish() : setPage(page + 1)
                  }
                >
                  {page === Questions.length - 1 ? "Submit" : "Next"}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        <BoardControl
          {...{ page, counter, setQuestions, setCounter, questions, setPage }}
        />
      </div>
      <div className="counter p-5 mt-4 bg-white text-center shadow-lg rounded-lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          flexWrap="wrap"
          spacing={5}
          justifyContent="space-between"
          divider={<div>|</div>}
        >
          <div id="answered" className="answered">
            <label htmlFor="answered" className="font-medium">
              Answered
            </label>
            <div className="count font-semibold text-lg">
              {counter.answered.length}
            </div>
          </div>
          <div id="not-answered" className="not-answered">
            <label htmlFor="not-answered" className="font-medium">
              Not Answered
            </label>
            <div className="count font-semibold text-lg">
              {counter.not_answered.length}
            </div>
          </div>
          <div id="not-viewed" className="not-viewed">
            <label htmlFor="answered" className="font-medium">
              Not Viewed
            </label>
            <div className="count font-semibold text-lg">
              {counter.not_viewed.length}
            </div>
          </div>
        </Stack>
      </div>
    </div>
  );
}

export { getServerSideProps };
