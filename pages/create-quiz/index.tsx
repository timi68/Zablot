/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-css-tags */
import React from "react";
import Layout from "../../src/AppLayout";
import { AppContext } from "../../lib/context";
import NoSession from "../../components/nosession";
import EditQuestion from "../../components/createQuiz/editQuestion";
import CreateQuestion from "../../components/createQuiz/createQuestion";
import UploadQuestions from "../../components/createQuiz/uploadQuestions";
import CreatedQuestions from "../../components/createQuiz/createdQuestions";
import { Container, CircularProgress } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import * as Interfaces from "../../lib/interfaces";
import FetchUser from "../../lib/fetch_user";
import { NextRouter, useRouter } from "next/router";

function QuizCreator(props: { user: string }) {
  const {
    state: { loggedIn, user, socket },
    dispatch,
  } = React.useContext(AppContext);
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
    if (!user || !socket || !loggedIn) {
      if (props?.user) {
        FetchUser(dispatch, enqueueSnackbar, props.user, router);
        return;
      }
      axios.get("/logout").then((response) => {
        socket?.disconnect();
      });
      return;
    }
  }, []);

  console.log("Mounting from create Quiz");

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
  const user = req.session.user;
  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }

  return {
    props: { user },
  };
}

export default QuizCreator;
