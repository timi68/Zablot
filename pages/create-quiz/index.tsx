/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-css-tags */
import React from "react";
import Layout from "@src/AppLayout";
import NoSession from "@comp/nosession";
import EditQuestion from "@comp/createQuiz/editQuestion";
import CreateQuestion from "@comp/createQuiz/createQuestion";
import UploadQuestions from "@comp/createQuiz/uploadQuestions";
import CreatedQuestions from "@comp/createQuiz/createdQuestions";
import { Container, CircularProgress } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import * as Interfaces from "@lib/interfaces";
import FetchUser from "@lib/fetch_user";
import { NextRouter, useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import getUser from "@lib/getUser";

function QuizCreator(props: { user: string }) {
  const { loggedIn, user, socket } = useAppSelector(
    (state) => state.sessionStore
  );
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const router: NextRouter = useRouter();
  const uploadQuestionsRef = React.useRef<HTMLDivElement & Interfaces.Handle>(
    null
  );
  const editingQuestionRef = React.useRef<HTMLDivElement & Interfaces.Handle>(
    null
  );
  const createdQuestionsRef = React.useRef<HTMLDivElement & Interfaces.Handle>(
    null
  );
  // const [upload, setUpload] = useState<boolean>(false);

  React.useEffect(() => {
    !user && FetchUser(dispatch, enqueueSnackbar, props.user);
  }, []);

  if (loggedIn && user && socket) {
    return (
      <div className="create-quiz-wrapper">
        <UploadQuestions ref={uploadQuestionsRef} />
        <CreateQuestion setQuestion={createdQuestionsRef} />
        <CreatedQuestions
          ref={createdQuestionsRef}
          edit={editingQuestionRef}
          upload={uploadQuestionsRef}
        />
        <EditQuestion
          ref={editingQuestionRef}
          setQuestion={createdQuestionsRef}
        />
      </div>
    );
  } else if (props?.user) {
    return (
      <Container
        sx={{
          width: "100vw",
          height: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress />
        Loading...
      </Container>
    );
  } else {
    return <NoSession />;
  }
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
