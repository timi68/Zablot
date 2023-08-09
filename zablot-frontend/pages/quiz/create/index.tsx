import React from "react";
import CreateQuestion from "@comp/quiz/createQuestion";
import { useSnackbar } from "notistack";
import FetchUser from "@lib/fetch_user";
import { NextRouter, useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import { getServerSideProps } from "pages/dashboard";

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

export { getServerSideProps };
export default QuizCreator;
