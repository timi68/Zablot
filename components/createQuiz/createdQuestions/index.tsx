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
import { Fab, Button, Box, Tooltip, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import j from "jquery";
import { useSnackbar } from "notistack";
import * as Interfaces from "@lib/interfaces";
import Cookie from "js-cookie";

const CreatedQuestions: React.ForwardRefExoticComponent<Interfaces.CreatedQuestionInterface> =
  forwardRef(
    (
      { edit, upload }: Interfaces.CreatedQuestionInterface,
      ref
    ): JSX.Element => {
      const [state, setState] = useState<Interfaces.State>({
        questions: JSON.parse(Cookie.get("Questions") ?? null) ?? [],
      });
      const [open, setOpen] = useState<boolean>(false);
      const scrollTop = useRef<HTMLDivElement>(null);
      const questionListRef = useRef<HTMLUListElement>(null);
      const { enqueueSnackbar, closeSnackbar } = useSnackbar();

      const showSnackbar = useCallback(
        function (
          message: string,
          variant?: "info" | "success",
          duration?: number
        ) {
          enqueueSnackbar(message, {
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            variant: variant,
            autoHideDuration: duration ?? 3000,
          });
        },
        [enqueueSnackbar]
      );

      useImperativeHandle(
        ref,
        () => ({
          setQuestions(newQuestion: Interfaces.Question, questionId?: number) {
            if (questionId !== undefined) {
              setState((oldState: Interfaces.State): Interfaces.State => {
                let newQuestions: Interfaces.Question[] =
                  oldState.questions.map(
                    (question: Interfaces.Question, index: number) => {
                      if (questionId === index) return newQuestion;
                      return question;
                    }
                  );
                Cookie.set("Questions", JSON.stringify(newQuestions));
                return {
                  questions: newQuestions,
                  update: questionId,
                };
              });

              showSnackbar(`Question ${questionId + 1} Updated`, "success");
              return;
            }

            setState((oldState) => {
              let newQuestions: {
                questions: Interfaces.Question[];
              } = {
                questions: [...oldState.questions, ...[newQuestion]],
              };

              Cookie.set("Questions", JSON.stringify(newQuestions.questions));

              return newQuestions;
            });

            showSnackbar("Question saved successfully", "success");
          },
        }),
        [state, showSnackbar]
      );

      useLayoutEffect(() => {
        if (state.questions?.length) {
          showSnackbar("You have unfinished quiz set up", "info", 4000);
        }
      }, []);

      useLayoutEffect(() => {
        if (!isNaN(state.update)) {
          let scrollToView =
            (questionListRef.current.children[state.update] as HTMLLIElement)
              .offsetTop - 70;
          j(scrollTop.current).prop("scrollTop", scrollToView);
        } else if (!state.removing) {
          j(scrollTop.current).animate(
            {
              scrollTop: scrollTop.current.scrollHeight - 450,
            },
            "slow"
          );
        }
      }, [state, open]);

      const DeleteQuestion = (questionId: number | string) => {
        setState((oldQuestions) => {
          let newQuestions = oldQuestions.questions.filter(
            (question, index) => {
              console.log(Number(questionId));
              if (!isNaN(questionId as number)) return questionId !== index;
              return false;
            }
          );
          if (newQuestions?.length)
            Cookie.set("Questions", JSON.stringify(newQuestions));
          else Cookie.remove("Questions");
          return { questions: newQuestions, removing: true };
        });
        if (isNaN(questionId as number))
          showSnackbar(
            `Interfaces.Question ${(questionId as number) + 1} deleted`,
            "success"
          );
        else showSnackbar(`All Interfaces.Question Deleted`, "success");
      };

      return (
        <Fragment>
          <div className={`created-questions-container${open ? " open" : ""}`}>
            <div className="created-questions">
              <div className="wrap" ref={scrollTop}>
                <div className="header">
                  <div className="title">Quiz Questions Created</div>
                  <Button className="close-btn" onClick={() => setOpen(!open)}>
                    Close
                  </Button>
                </div>
                <ul className="question-list" ref={questionListRef}>
                  <Typography variant="subtitle2" component="div" mb={2}>
                    Total Questions : {state.questions.length}
                  </Typography>
                  <AnimatePresence>
                    {state.questions?.map(
                      (
                        question: Interfaces.Question,
                        questionIndex: number
                      ) => {
                        return (
                          <motion.li
                            key={questionIndex}
                            animate={{
                              opacity: 1,
                            }}
                            initial={{
                              opacity: 0,
                            }}
                            exit={{
                              opacity: 0,
                            }}
                            className="question-wrapper ques"
                          >
                            <div className="question-index">
                              <div className="index-text">
                                Questions {questionIndex + 1}
                              </div>
                            </div>
                            <div className="question-box">
                              <div className="title label">
                                <div className="label-text">Question</div>
                              </div>
                              <div className="text">{question.question}</div>
                            </div>
                            <div className="question-options options-wrapper">
                              <div className="title label">
                                <div className="label-text">Options</div>
                              </div>
                              <ul className="option-list">
                                {question.options.map((option, optionIndex) => {
                                  return (
                                    <li
                                      key={optionIndex}
                                      className="question-option answer"
                                    >
                                      <div className="text">{option.text}</div>
                                      {option.checked && (
                                        <Tooltip
                                          title="Correct answer"
                                          placement="top"
                                          className="answer-tooltip"
                                        >
                                          <CheckCircleIcon
                                            fontSize="small"
                                            className="answer-check"
                                          />
                                        </Tooltip>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                            <Box className="fab-wrapper">
                              <Fab
                                size="small"
                                onClick={() => DeleteQuestion(questionIndex)}
                                title="Delete Interfaces.Question"
                                aria-label="delete question"
                                className="delete-bt fab"
                              >
                                <DeleteForeverIcon className="fab-icon" />
                              </Fab>
                              <Fab
                                aria-label="edit question"
                                className="edit-btn fab"
                                title="Edit Interfaces.Question"
                                onClick={() =>
                                  edit.current.setQuestionToEdit(
                                    questionIndex,
                                    question
                                  )
                                }
                                size="small"
                              >
                                <EditIcon className="fab-icon" />
                              </Fab>
                            </Box>
                          </motion.li>
                        );
                      }
                    )}
                  </AnimatePresence>
                  {!Boolean(state.questions?.length) && (
                    <div className="no-question-created">
                      No Question Created
                    </div>
                  )}
                </ul>
                {Boolean(state.questions.length) && (
                  <div className="button-wrap">
                    <Button
                      className="create-btn btn"
                      onClick={() => {
                        upload.current.setOpen(state.questions);
                      }}
                    >
                      Upload
                    </Button>
                    <Button
                      className="reset-btn btn"
                      onClick={() => DeleteQuestion("all")}
                    >
                      Reset Questions
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {!open && (
              <motion.div
                initial={{ width: "max-content", scale: 0.2 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.0, opacity: 0.5 }}
              >
                <Tooltip
                  title="See created questions"
                  color="primary"
                  sx={{ fontFamily: "Poppins", p: 1, fontWeight: 400 }}
                  placement="left"
                >
                  <Fab
                    aria-label="Created-Question toggler"
                    color="secondary"
                    size="small"
                    className="question-toggler"
                    onClick={() => {
                      setOpen(true);
                      setState((oldState) => {
                        return { questions: oldState.questions };
                      });
                    }}
                  >
                    {state.questions.length}
                  </Fab>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>
        </Fragment>
      );
    }
  );
CreatedQuestions.displayName = "CreateQuestion";

export default CreatedQuestions;
