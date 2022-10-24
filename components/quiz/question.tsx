import React from "react";
import { Fab, Box, Tooltip, Chip, Zoom, IconButton } from "@mui/material";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import { Question } from "@types";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import {
  getQuestion,
  removeQuestion,
  updateQuestion,
} from "@lib/redux/questionSlice";
import j from "jquery";
import SaveIcon from "@mui/icons-material/Save";
import HistoryIcon from "@mui/icons-material/History";
import useController from "@lib/client/question";
import { OptionsObject, useSnackbar } from "notistack";
import Option from "@comp/Option";
import AddIcon from "@mui/icons-material/Add";
import { useCustomEventListener } from "react-custom-events";

interface QuestionProp {
  question_id: string | number;
}

const variant = {
  animate: { opacity: 1 },
  initial: { opacity: 0 },
  exit: { opacity: 0, scale: 0 },
};

function Question(props: QuestionProp) {
  const storedQuestion = useAppSelector((state) =>
    getQuestion(state, props.question_id)
  );
  const _this = React.useRef<HTMLLIElement>(null);
  const dispatch = useAppDispatch();
  const [unMount, setUnMount] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [question, setQuestion] = React.useState(storedQuestion);
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    const $wrap = j(".created-questions .wrap");
    $wrap.animate(
      {
        scrollTop: $wrap.prop("scrollHeight"),
      },
      "slow"
    );
  }, []);

  const options: OptionsObject = {
    anchorOrigin: {
      vertical: "top",
      horizontal: "right",
    },
  };

  const controller = useController(
    "question",
    enqueueSnackbar,
    setQuestion,
    options
  );

  const update = () => {
    dispatch(updateQuestion({ id: props.question_id, changes: question }));
    setEditing(false);
  };

  useCustomEventListener("removeAll", () => setUnMount(true));

  return (
    <AnimatePresence
      onExitComplete={() => dispatch(removeQuestion(props.question_id))}
    >
      {!unMount && (
        <motion.li
          layout
          key={props.question_id}
          {...variant}
          className="question-wrapper ques"
          ref={_this}
        >
          <motion.div layout className="question-index">
            <Chip label={question.key} size="small" />
          </motion.div>
          <LayoutGroup>
            <motion.div layout className="question-box">
              <motion.div layout className="title label">
                <div className="label-text">Question</div>
              </motion.div>
              {editing ? (
                <motion.textarea
                  className="rounded-lg w-full resize-none shadow-lg p-2 overflow-visible"
                  id="question"
                  value={question.question}
                  onChange={(e) =>
                    controller.questionChange.call(controller, e)
                  }
                  placeholder="Enter your question.."
                />
              ) : (
                <div
                  contentEditable={editing}
                  className="text-base font-medium bg-white p-2 rounded-lg shadow-lg"
                  dangerouslySetInnerHTML={{ __html: question.question }}
                />
              )}
            </motion.div>
            <motion.div layout className="question-options options-wrapper">
              <motion.div layout className="flex justify-between p-1">
                <div className="label-text">Options</div>
                <AnimatePresence>
                  {question.options.length < 4 && editing && (
                    <motion.div exit={{ scale: 0 }} animate={{ scale: 1 }}>
                      <IconButton
                        className="add text-white bg-green rounded-lg"
                        size="small"
                        onClick={() => controller.AddOptions.call(controller)}
                        aria-label="add option button"
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.ul layout className="option-list grid gap-2">
                {question.options.map((option, optionIndex) => {
                  return !editing ? (
                    <motion.li
                      exit={{ scale: 0, height: 0 }}
                      animate={{ scale: 1 }}
                      initial={{ scale: 0 }}
                      key={optionIndex}
                      className="question-option break-all"
                    >
                      <div
                        className="text-sm font-medium bg-white p-2 rounded-lg shadow-lg"
                        dangerouslySetInnerHTML={{ __html: option.text }}
                      />
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
                    </motion.li>
                  ) : (
                    <Option
                      key={option.key}
                      option={option}
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
              </motion.ul>
            </motion.div>
          </LayoutGroup>
          <Zoom in={editing} unmountOnExit>
            <motion.div layout className="fab-wrapper">
              <Fab
                size="small"
                onClick={() => (
                  controller.clearChanges.call(controller), setEditing(false)
                )}
                title="Clear changes"
                aria-label="clear changes"
                className="delete-bt fab bg-slate-500 hover:bg-red-200"
              >
                <HistoryIcon className="fab-icon" />
              </Fab>
              <Fab
                aria-label="save changes"
                className="edit-btn fab bg-lime-600"
                title="Save Changes"
                onClick={() =>
                  controller.submitQuestion.call(controller, update)
                }
                size="small"
              >
                <SaveIcon className="fab-icon" />
              </Fab>
            </motion.div>
          </Zoom>
          <Zoom in={!editing} unmountOnExit>
            <motion.div layout className="fab-wrapper">
              <Fab
                size="small"
                onClick={() => setUnMount(true)}
                title="Delete Question"
                aria-label="delete question"
                className="delete-bt fab bg-red-800 hover:bg-red-300"
              >
                <DeleteForeverIcon className="fab-icon" />
              </Fab>
              <Fab
                aria-label="edit question"
                className="edit-btn fab"
                title="Edit Question"
                onClick={() => setEditing(true)}
                size="small"
              >
                <EditIcon className="fab-icon" />
              </Fab>
            </motion.div>
          </Zoom>
        </motion.li>
      )}
    </AnimatePresence>
  );
}

export default React.memo(Question);
