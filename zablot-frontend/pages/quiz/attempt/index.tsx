import React, { BaseSyntheticEvent, SyntheticEvent } from "react";
import { useSnackbar } from "notistack";
import { Quiz as QuizType } from "@types";
import FetchUser from "@lib/fetch_user";
import axios from "axios";
import { NextRouter, useRouter } from "next/router";
import { Divider, Grid, Tooltip } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import jsonwebtoken from "jsonwebtoken";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import getUser from "@lib/getUser";
import Link from "next/link";
import Quiz from "@comp/quiz/quiz";
import View from "@comp/quiz/View";
import { Quizzes } from "@lib/quizzes";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { getServerSideProps } from "pages/dashboard";

export default function PastQuestions(props: { user: string }) {
  const user = useAppSelector((state) => state.sessionStore.user);
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const router: NextRouter = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [quizzes, setQuizzes] = React.useState<QuizType[]>(Quizzes);

  React.useEffect(() => {
    !user && FetchUser(dispatch, enqueueSnackbar, props.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getQuiz = async (formData) => {
    setIsLoading(true);
    console.log({ formData });
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="attempt-quiz-wrapper p-3 h-full overflow-auto flex-grow">
      <div className="flex flex-wrap py-3 justify-between w-full rounded-lg h-max items-center gap-3">
        <div className="text flex-shrink">
          <Tooltip title="Go back to previous page" placement="bottom">
            <motion.div
              whileHover={{ scale: 0.9 }}
              className="relative bg-green h-[30px] w-[30px] rounded-3xl"
            >
              <motion.button
                onClick={() => router.push("/quiz")}
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
        </div>
        <div className="primary flex-grow hidden sm:block text-xl font-extrabold font-[nunito]">
          Checkout Prepared Quiz
        </div>

        <div className="form-group flex-grow max-w-[300px]">
          <motion.input
            whileFocus={{
              scale: 1.03,
            }}
            className="border border-solid shadow-lg w-full bg-transparent border-gray-700 p-2 rounded-lg"
            placeholder="Enter quiz id | title | category"
          />
        </div>
      </div>
      <Divider>
        <span className="text-xs">
          Attempt quiz to check your level of preparation.
        </span>
      </Divider>
      <div className="main-content p-3 mt-3">
        <Grid
          rowSpacing={3}
          columnSpacing={2}
          container
          className="cards-wrapper quizzes"
        >
          {quizzes.map((quiz) => {
            return (
              <Grid item xs={12} sm={6} key={quiz._id} md={4} lg={3}>
                <Quiz quiz={quiz} />
              </Grid>
            );
          })}
        </Grid>
        <AnimatePresence>
          {router.query.view && (
            <View quizzes={quizzes} view={router.query.view as string} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export { getServerSideProps };
