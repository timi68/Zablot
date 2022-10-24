import React from "react";
import CreateQuestion from "@comp/quiz/createQuestion";
import { useSnackbar } from "notistack";
import FetchUser from "@lib/fetch_user";
import { NextRouter, useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import getUser from "@lib/getUser";

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
    <div className="create-quiz-wrapper">
      <CreateQuestion />
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
