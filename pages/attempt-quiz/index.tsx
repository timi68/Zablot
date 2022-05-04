import React, { BaseSyntheticEvent, SyntheticEvent } from "react";
import AppLayout from "../../src/AppLayout";
import { useSnackbar } from "notistack";
import * as Interfaces from "../../lib/interfaces";
import FetchUser from "../../lib/fetch_user";
import axios from "axios";
import { AppContext } from "../../lib/context";
import { NextRouter, useRouter } from "next/router";
import { TextField, Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import jsonwebtoken from "jsonwebtoken";
import { useForm } from "react-hook-form";

export default function PastQuestions(props: { user: string }) {
  const {
    state: { loggedIn, user, socket },
    dispatch,
  } = React.useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const router: NextRouter = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<typeof quiz>();
  const [quiz, setQuiz] = React.useState<{
    name: String;
    id: string;
    key?: "";
    required?: boolean;
  }>({ name: "", id: "" });

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
  }, [socket, enqueueSnackbar, dispatch, props, user, loggedIn, router]);

  const getQuiz = async (formData) => {
    setIsLoading(true);
    console.log({ formData });
    setTimeout(() => {
      setIsLoading(false);
      setQuiz({ ...quiz, required: true });
    }, 3000);
  };

  const verifyPassword = async (formData) => {
    setIsLoading(true);
    const session = jsonwebtoken.sign(quiz, "james", { expiresIn: 1000000 });
    router.push(`/attempt-quiz/${quiz.name}/${session}`);
  };

  const handleChange = (change: React.BaseSyntheticEvent) => {
    setQuiz({ ...quiz, [change.target.name]: change.target.value });
  };

  return (
    <div className="attempt-quiz-wrapper">
      <div className="header">
        <div className="page-title">Attempt Quiz</div>
      </div>
      <div className="body">
        {!isLoading && !quiz.required && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="auth"
          >
            <form
              action="#"
              className="quiz-form"
              onSubmit={handleSubmit(getQuiz)}
            >
              <div className="form-label">Quiz Details</div>
              <TextField
                label="Quiz name"
                fullWidth
                variant="outlined"
                margin="dense"
                sx={{ mt: 1 }}
                error={Boolean(errors.name)}
                helperText={errors.name && "This field is required*"}
                {...register("name", {
                  required: true,
                  onChange: handleChange,
                })}
              />
              <TextField
                label="Enter quiz id"
                fullWidth
                variant="outlined"
                margin="dense"
                sx={{ mt: 1 }}
                error={Boolean(errors.id)}
                helperText={errors.id && "This field is required*"}
                {...register("id", { required: true, onChange: handleChange })}
              />
              <div className="form-action">
                <Button
                  className={"btn-toggle"}
                  color="primary"
                  variant="contained"
                  fullWidth
                  size="large"
                  type="submit"
                  sx={{ color: "#fff", fontWeight: 500 }}
                >
                  <span className="text">Go to Quiz</span>
                </Button>
              </div>
            </form>
          </motion.div>
        )}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="loader"
          >
            <CircularProgress size={70} />
            <div className="label">Fetching Quiz for you...</div>
          </motion.div>
        )}
        {!isLoading && quiz.required && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="auth"
          >
            <form
              action="#"
              className="quiz-form"
              onSubmit={handleSubmit(verifyPassword)}
            >
              <div className="form-label">
                A security key is required this quiz
              </div>
              <TextField
                label="Enter quiz password"
                fullWidth
                variant="outlined"
                margin="dense"
                sx={{ mt: 1 }}
                error={Boolean(errors.key)}
                helperText={
                  errors.key && "Key is required to access this quiz*"
                }
                {...register("key", { required: true, onChange: handleChange })}
              />
              <div className="form-action">
                <Button
                  className={"btn-toggle"}
                  color="primary"
                  variant="contained"
                  fullWidth
                  size="large"
                  type="submit"
                  sx={{ color: "#fff", fontWeight: 500 }}
                  onClick={verifyPassword}
                >
                  <span className="text">Submit</span>
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
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
