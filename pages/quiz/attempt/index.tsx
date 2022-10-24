import React, { BaseSyntheticEvent, SyntheticEvent } from "react";
import { useSnackbar } from "notistack";
import { Quiz as QuizType } from "@types";
import FetchUser from "@lib/fetch_user";
import axios from "axios";
import { NextRouter, useRouter } from "next/router";
import { Divider, Grid } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import jsonwebtoken from "jsonwebtoken";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import getUser from "@lib/getUser";
import Link from "next/link";
import Quiz from "@comp/quiz/quiz";
import View from "@comp/quiz/View";
import { Quizzes } from "./quizzes";

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
    <div className="attempt-quiz-wrapper h-full overflow-auto">
      <div className="flex justify-between w-full p-3 rounded-lg h-max items-center gap-3">
        <div className="text flex-shrink">
          <div className="primary text-2xl mb-2 font-extrabold font-[nunito]">
            Checkout Prepared Quiz
          </div>
          <div className="secondary text-xs max-w-[600px]">
            Get to attempt and check your level of preparation. This page
            contains that has been set for public assessment, excluding premium.
          </div>
        </div>
        <div className="form-group">
          <motion.input
            whileFocus={{
              scale: 1.03,
            }}
            className="border border-solid shadow-lg border-gray-700 p-2 w-[250px] rounded-3xl"
            placeholder="Enter quiz id | title | category"
          />
        </div>
      </div>
      <Divider>
        <span>Do not sleep on it.</span>
      </Divider>
      <div className="main-content p-3">
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
