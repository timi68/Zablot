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

  if (!user) return <></>;

  return (
    <div className="quiz flex-grow px-2 py-4 h-full overflow-auto">
      <div className="flex flex-wrap justify-between w-full rounded-lg h-max items-center gap-3">
        <div className="text flex-shrink">
          <div className="primary text-xl mb-2 font-bold">Your Quiz</div>
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
      <div className="secondary hidden sm:block text-xs max-w-[600px]">
        Be an help to other fellow, set up a cook up possible questions that
        most likely to come out in their next exam.
      </div>
      <Divider className="my-3" />
      <div className="quizzes-container">
        <Grid container spacing={2}>
          {Array.from(new Array(8)).map((key) => {
            return (
              <Grid
                xs={12}
                sm={5}
                md={4}
                lg={3}
                item
                key={key}
                className="h-[250px]"
              >
                <Skeleton height={"100%"} variant="rounded" width="100%" />
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
