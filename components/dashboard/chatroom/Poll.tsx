import React from "react";
import {
  motion,
  AnimatePresence,
  AnimateSharedLayout,
  LayoutGroup,
} from "framer-motion";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { IconButton } from "@mui/material";
import * as Interfaces from "@lib/interfaces";
import j from "jquery";
import Option from "../../Option";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import { propsToClassKey } from "@mui/styles";
import { updateRoom } from "@lib/redux/roomSlice";
import store from "@lib/redux/store";
import { nanoid } from "@reduxjs/toolkit";
import makeController from "@lib/client/question";
import { useSnackbar } from "notistack";

const variant = {
  hidden: {
    clipPath: "circle(0.4% at 0 100%)",
  },
  visible: {
    clipPath: "circle(141% at 0 100%)",
    zIndex: 1000,
    transition: {
      duration: 0.1,
      type: "spring",
    },
  },
  exit: {
    clipPath: "circle(0.4% at 0 100%)",
  },
};

type PropsType = {
  roomBody: React.RefObject<Interfaces.RoomBodyRefType>;
  coming: string;
  _id: string;
  going: string;
  room_id: string | number;
};

const Poll = React.forwardRef((props: PropsType, ref) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [question, setQuestion] = React.useState<Interfaces.MessageType>({
    question: "",
    options: [
      { text: "", checked: false, key: nanoid() },
      { text: "", checked: false, key: nanoid() },
    ],
    Format: "Form",
    _id: props._id,
    coming: props.coming,
    going: props.going,
  });
  const { enqueueSnackbar } = useSnackbar();
  const socket = useAppSelector((state) => state.sessionStore.socket);
  const PollRef = React.useRef<HTMLUListElement>(null);
  const Backdrop = React.useRef<HTMLDivElement>(null);
  const controller = makeController("poll", enqueueSnackbar, setQuestion);

  const AdditionalOptions = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.name === "challenge") {
        setQuestion((question) => ({
          ...question,
          [e.target.name]: e.target.checked,
        }));
        return;
      }
      setQuestion((question) => ({
        ...question,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  const SendPoll = React.useCallback(() => {
    socket.emit(
      "OUTGOINGFORM",
      question,
      (err: string, { formId, date }: { formId: string; date: number }) => {
        if (!err) {
          question._id = formId;
          question.date = date;
          const messages =
            store.getState().rooms.entities[props.room_id].messages;
          dispatch(
            updateRoom({
              id: props.room_id,
              changes: {
                messages: [...messages, question],
                type: "out",
              },
            })
          );
          setOpen(false);
        }
      }
    );
  }, [dispatch, props.room_id, question, socket]);

  React.useImperativeHandle(
    ref,
    () => ({
      toggle: () => setOpen(true),
    }),
    []
  );

  React.useEffect(() => {
    const mutation = new MutationObserver(function (e) {
      let addedOption = e[0].addedNodes[0];
      if (addedOption) j(addedOption).find("textarea").focus();

      PollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });

    if (open) {
      mutation.observe(PollRef.current, { childList: true });
    }
    return () => {
      mutation.disconnect();
    };
  }, [open]);

  const CaptureClick = React.useCallback(
    (e: React.MouseEvent) => {
      var target = e.target === Backdrop.current;
      if (target) setOpen(!open);
    },
    [open]
  );

  if (!controller) return;

  return (
    <AnimatePresence mode="wait" onExitComplete={() => null}>
      {open && (
        <>
          <div
            ref={Backdrop}
            onClickCapture={CaptureClick}
            className="poll-backdrop absolute bottom-0 top-0 left-0 h-screen w-screen bg-black bg-opacity-10"
          />
          <motion.div
            initial={{ opacity: 0.8 }}
            exit={{ opacity: 0.8 }}
            animate={{ opacity: 1, zIndex: 1000 }}
          >
            <motion.div
              variants={variant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="create-question create-poll"
              // ref={PollRef}
            >
              <div className="poll-header">
                <div className="title">
                  <div className="text">Poll</div>
                </div>
                <div
                  className="discard-wrap shadow-xl"
                  onClick={() => {
                    controller.setDefault.call(controller), setOpen(false);
                  }}
                >
                  <span>Discard</span>
                </div>
                <div
                  className="create-wrap bg-green text-white"
                  onClick={() =>
                    controller.submitQuestion.call(controller, SendPoll)
                  }
                >
                  <span>Create</span>
                </div>
              </div>
              <div className="poll-body">
                <motion.div className="question-box">
                  <div className="title">
                    <div className="text">Question</div>
                  </div>
                  <div className="text-box question">
                    <textarea
                      className="text-control"
                      id="question"
                      name="question"
                      onChange={(e) =>
                        controller.questionChange.call(controller, e)
                      }
                      placeholder="Enter your question.."
                    ></textarea>
                  </div>
                </motion.div>
                <motion.div className="question-options">
                  <div className="header">
                    <div className="title">
                      <div className="text">Options</div>
                    </div>
                    {question.options.length < 4 && (
                      <IconButton
                        className="add-options add"
                        onClick={() => controller.AddOptions.call(controller)}
                      >
                        <AddRoundedIcon fontSize="small" />
                      </IconButton>
                    )}
                  </div>
                  <ul className="option-list wrap" ref={PollRef}>
                    <AnimatePresence>
                      {question.options.map((option, index) => {
                        return (
                          <Option
                            key={option.key}
                            option={option}
                            HandleAnswerChecked={(key: string) =>
                              controller.answerChecked.call(controller, key)
                            }
                            HandleOptionTextChange={(
                              e: React.ChangeEvent<HTMLTextAreaElement>,
                              key: string
                            ) =>
                              controller.optionChange.call(controller, e, key)
                            }
                            RemoveOption={(key: string) =>
                              controller.removeOption.call(controller, key)
                            }
                          />
                        );
                      })}
                    </AnimatePresence>
                  </ul>
                </motion.div>
                <motion.div layout className="additional-options">
                  <div className="title">
                    <div className="text">Additional options</div>
                  </div>
                  <div className="options">
                    <div className="option-wrap timer">
                      <label htmlFor="timing" className="label">
                        Set time(s)
                      </label>
                      <input
                        className="text-control time"
                        type="text"
                        id="timing"
                        name="timer"
                        onChange={AdditionalOptions}
                        maxLength={3}
                        autoComplete="new"
                      />
                    </div>
                    <div className="coin option-wrap">
                      <label htmlFor="coin" className="label">
                        Add coin
                      </label>
                      <input
                        className="text-control coin"
                        type="text"
                        id="coin"
                        name="coin"
                        onChange={AdditionalOptions}
                        maxLength={3}
                        autoComplete="new"
                      />
                    </div>
                    <div className="challenge option-wrap">
                      <div className="label-text">
                        <div className="text">Challenge</div>
                      </div>
                      <div className="control">
                        <input
                          className="radio challenge"
                          type="checkbox"
                          id="challenge"
                          onChange={AdditionalOptions}
                          name="challenge"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

Poll.displayName = "Poll";

export default React.memo(Poll);
