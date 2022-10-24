import React from "react";
import CreateQuestion from "@comp/quiz/createQuestion";
import { useSnackbar } from "notistack";
import FetchUser from "@lib/fetch_user";
import { NextRouter, useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import getUser from "@lib/getUser";
import { motion } from "framer-motion";
import { Divider, Grid, Skeleton } from "@mui/material";
import Link from "next/link";

function QuizCreator(props: { user: string }) {
  const user = useAppSelector((state) => state.sessionStore.user);
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const router: NextRouter = useRouter();

  React.useEffect(() => {
    !user && FetchUser(dispatch, enqueueSnackbar, props.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="quiz flex-grow p-2">
      <div className="flex justify-between w-full p-3 rounded-lg h-max items-center gap-3">
        <div className="text flex-shrink">
          <div className="primary text-2xl mb-2 font-extrabold font-[nunito]">
            Your Quiz
          </div>
          <div className="secondary text-sm max-w-[600px]">
            Be an help to other fellow, set up a cook up possible questions that
            most likely to come out in their next exam.
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/quiz/attempt" passHref>
            <motion.a
              href="#"
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              className="btn bg-green text-white rounded-lg shadow-xl min-w-max px-3 py-2 text-sm h-full"
            >
              Attempt
            </motion.a>
          </Link>
          <Link href="/quiz/create" passHref>
            <motion.a
              href="#"
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              className="btn text-green border border-green border-solid rounded-lg shadow-xl min-w-max px-3 py-2 text-sm h-full"
            >
              Create
            </motion.a>
          </Link>
        </div>
      </div>
      <Divider>
        <span>We want more prepared quiz from you.</span>
      </Divider>
      <div className="quizzes-container">
        <Grid container spacing={3}>
          {Array.from(new Array(8)).map((key) => {
            return (
              <Grid
                xs={12}
                sm={5}
                md={4}
                lg={3}
                item
                key={key}
                className="h-max"
              >
                <Skeleton height={250} width="100%" />
              </Grid>
            );
          })}
        </Grid>
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

export default QuizCreator;
