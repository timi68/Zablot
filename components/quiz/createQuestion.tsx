import React, { useState } from "react";
import { Button, Box, IconButton, Tooltip, Divider } from "@mui/material";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  AnimateSharedLayout,
} from "framer-motion";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "notistack";
import { Question } from "@lib/interfaces";
import { nanoid } from "@reduxjs/toolkit";
import makeController from "@lib/client/question";
import Option from "@comp/Option";
import { useAppDispatch } from "@lib/redux/store";
import { addQuestion } from "@lib/redux/questionSlice";
import CreatedQuestions from "@comp/quiz/createdQuestion";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { useRouter } from "next/router";

const CreateQuestion = () => {
  const router = useRouter();
  const [question, setQuestion] = useState<Question>({
    key: nanoid(),
    question: "",
    options: [
      { text: "", checked: false, key: nanoid() },
      { text: "", checked: false, key: nanoid() },
    ],
  });

  const dispatch = useAppDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const controller = makeController("quiz", enqueueSnackbar, setQuestion);
  const storeQuestion = () => dispatch(addQuestion(question));
  if (!controller) return;

  return (
    <>
      <Box
        sx={{ flexGrow: 1 }}
        className="create-question-container flex-grow create-box form-container"
      >
        <Box className="create-wrapper max-w-[90%] mx-auto">
          <div className="header-top flex justify-between">
            <div className="text">
              <div className="text-xl font-extrabold uppercase font-[nunito,poppins,calibri]">
                Let Set It Up
              </div>
              <p className="text-sm">
                Create your quiz to challenge your student or coursemates
              </p>
            </div>
            <Tooltip title="Go back to previous page" placement="bottom">
              <motion.div
                whileHover={{ scale: 0.9 }}
                className="relative bg-green h-[30px] w-[30px] rounded-3xl"
              >
                <motion.button
                  onClick={() => router.back()}
                  whileHover={{ x: -10 }}
                  whileTap={{ x: -20 }}
                >
                  <KeyboardBackspaceRoundedIcon
                    fontSize="large"
                    className="ml-[5px] mt-[-2px] text-white"
                  />
                </motion.button>
              </motion.div>
            </Tooltip>
          </div>
          <Divider className="text-xs my-5">
            <span>Start creating your questions</span>
          </Divider>
          <div className="question-wrap">
            <div className="text text-sm font-semibold">Question</div>
            <textarea
              className="bg-transparent p-3 text-sm h-[150px] w-full ring-1 rounded-lg mt-3 ring-slate-700 shadow-lg"
              id="question"
              value={question.question}
              onChange={(e) => controller.questionChange.call(controller, e)}
              placeholder="Enter your question.."
            />
          </div>
          <div className="my-5">
            <div className="header flex justify-between h-[40px] items-center bg-lowgrey rounded-sm shadow-2xl mb-5 px-4">
              <span className="title text-sm font-semibold">Options</span>
              <AnimatePresence>
                {question.options.length < 4 && (
                  <Tooltip title="Add options" placement="left">
                    <motion.div exit={{ scale: 0 }} animate={{ scale: 1 }}>
                      <IconButton
                        className="add text-white bg-green"
                        size="small"
                        onClick={() => controller.AddOptions.call(controller)}
                        aria-label="add option button"
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </motion.div>
                  </Tooltip>
                )}
              </AnimatePresence>
            </div>
            <div className="options-wrapper min-h-[200px]" role="listbox">
              <motion.ul
                layout
                className="option-list-container grid gap-2"
                role="list"
              >
                <AnimatePresence mode="sync">
                  {question.options.map((option, index) => {
                    return (
                      <Option
                        key={option.key}
                        option={option}
                        height={50}
                        HandleAnswerChecked={(key: string) =>
                          controller.answerChecked.call(controller, key)
                        }
                        HandleOptionTextChange={(
                          e: React.ChangeEvent<HTMLTextAreaElement>,
                          key: string
                        ) => controller.optionChange.call(controller, e, key)}
                        RemoveOption={(key: string) =>
                          controller.removeOption.call(controller, key)
                        }
                      />
                    );
                  })}
                </AnimatePresence>
              </motion.ul>
            </div>
          </div>
          <div className="button-wrap gap-3 flex bg-inherit">
            <Button
              color="error"
              variant="outlined"
              className="text-sm text-center capitalize font-semibold"
              onClick={() => controller.setDefault.call(controller)}
            >
              Reset
            </Button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              className="shadow-xl hover:bg-opacity-90 rounded-lg px-20 py-2 text-center font-semibold text-white bg-green"
              onClick={() =>
                controller.submitQuestion.call(controller, storeQuestion)
              }
            >
              Save
            </motion.button>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default CreateQuestion;
