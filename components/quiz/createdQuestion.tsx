/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Fragment,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";
import {
  Fab,
  Button,
  Box,
  Tooltip,
  Typography,
  Divider,
  Zoom,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import j from "jquery";
import { useSnackbar } from "notistack";
import * as Interfaces from "@lib/interfaces";
import Cookie from "js-cookie";
import Question from "./question";
import {
  addManyQuestion,
  getQuestionIds,
  localQuestions,
  removeAllQuestion,
} from "@lib/redux/questionSlice";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import Link from "next/link";
import { useRouter } from "next/router";
import { emitCustomEvent } from "react-custom-events";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import AddIcon from "@mui/icons-material/AddCircleOutlineRounded";

const CreatedQuestions: React.FC = (): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState<boolean>(false);
  const questions = useAppSelector(getQuestionIds);
  const device = useAppSelector((state) => state.sessionStore.device);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const notUpload = !router.asPath.includes("upload");
  const mount =
    router.asPath.includes("quiz/create") ||
    router.asPath.includes("quiz/upload");

  React.useEffect(() => {
    if (localQuestions().length && mount) {
      enqueueSnackbar("You have unfinished quiz set up", {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "info",
        autoHideDuration: 3000,
      });

      dispatch(addManyQuestion(localQuestions()));
    }
  }, []);

  if (!mount) {
    return <></>;
  }

  return (
    <Fragment>
      <div
        className={`created-questions-container${
          device != "desktop"
            ? ` absolute ${
                open ? " right-0" : " right-[-130%]"
              } m-0 w-full top-0`
            : ""
        }`}
      >
        <div className="created-questions">
          <motion.div layoutId="created" className="wrap pb-20">
            <div className="header sticky top-0">
              <div className="title">{questions.length} Questions Created</div>
              <Button className="close-btn" onClick={() => setOpen(!open)}>
                Close
              </Button>
            </div>
            <Divider />
            <motion.ul
              layout
              className="question-list min-h-[300px] grid place-items-center"
            >
              <AnimatePresence>
                {questions?.map((question_id, questionIndex) => {
                  return (
                    <Question key={question_id} question_id={question_id} />
                  );
                })}
              </AnimatePresence>
              {!Boolean(questions?.length) && (
                <div className="no-question-created">No Question Created</div>
              )}
            </motion.ul>
            {Boolean(questions.length) && (
              <div
                className={`flex p-3 justify-end left-0 w-full gap-4 ${
                  device !== "desktop" ? "" : "absolute bottom-2"
                } bg-lightgrey`}
              >
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  className="create-btn btn text-green px-4 rounded-lg ring-2 ring-green shadow-lg"
                  onClick={() =>
                    router.push(notUpload ? "/quiz/upload" : "/quiz/create")
                  }
                >
                  {notUpload ? (
                    <UploadRoundedIcon className="mr-2" />
                  ) : (
                    <AddIcon className="mr-2" />
                  )}
                  <span className="text-sm font-medium">
                    {notUpload ? "Upload" : "Add More Questions"}
                  </span>
                </motion.button>
                <Tooltip title="Clear all question">
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    className="reset-btn bg-red-100 hover:bg-red-500 shadow-lg p-1 rounded-lg text-red-900 hover:text-white"
                    onClick={() => {
                      emitCustomEvent("removeAll");
                      setTimeout(() => {
                        dispatch(removeAllQuestion());
                      }, 500);
                      !notUpload && router.push("/quiz/create");
                    }}
                  >
                    <RestartAltRoundedIcon />
                  </motion.button>
                </Tooltip>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Zoom in={device !== "desktop" && !open} unmountOnExit>
        <Tooltip
          title="See created questions"
          color="primary"
          sx={{ fontFamily: "Poppins", p: 1, fontWeight: 400 }}
          placement="left"
        >
          <Fab
            aria-label="Created-Question toggler"
            color="primary"
            size="small"
            className="question-toggler fixed bottom-16 right-3 text-white"
            onClick={() => {
              setOpen(true);
            }}
          >
            {questions.length}
          </Fab>
        </Tooltip>
      </Zoom>
    </Fragment>
  );
};

export default React.memo(CreatedQuestions);
