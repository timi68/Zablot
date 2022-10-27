/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { MessageType } from "@lib/interfaces";
import GroupMessage from "@lib/Group_Message";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import { UpdateState } from "@lib/redux/store";
import { emitCustomEvent } from "react-custom-events";

type DataType = {
  messageId: string;
  OptionPicked: { text: string; checked: boolean };
};

function OutgoingForm(props: {
  message: MessageType;
  pre: Date | null;
  room_id: string | number;
}) {
  const { message, pre, room_id } = props;
  const socket = useAppSelector((state) => state.sessionStore.socket);
  const dispatch = useAppDispatch();
  const FormRef = React.useRef<HTMLDivElement>(null);
  const Group = GroupMessage({ cur: new Date(message.date), pre });

  const _callback$Answered = React.useCallback(
    (data: DataType) => {
      UpdateState(
        { answered: data.OptionPicked },
        dispatch,
        room_id,
        message._id
      );

      let action = data.OptionPicked.checked ? "add" : "less";
      emitCustomEvent("coin", { num: message.coin, action });
    },
    [dispatch, message._id, message.coin, room_id]
  );

  const _callback$NoAnswer = React.useCallback(
    (data: DataType) => {
      UpdateState({ noAnswer: true }, dispatch, room_id, message._id);
      emitCustomEvent("coin", { num: message.coin, action: "add" });
    },
    [dispatch, message, room_id]
  );

  React.useLayoutEffect(() => {
    if (message?.answered) {
      FormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
    if (socket && !message?.answered && !message?.noAnswer) {
      socket.on("ANSWERED", _callback$Answered);
      socket.on("NOANSWER", _callback$NoAnswer);
    }

    return () => {
      socket?.off("ANSWERED", _callback$Answered);
      socket?.on("NOANSWER", _callback$NoAnswer);
    };
  }, [_callback$Answered, _callback$NoAnswer, message, socket]);

  const className = `outgoing-message outgoing-form`;
  const formMessageClass = `form-message poll question`;

  return (
    <React.Fragment>
      {Group && (
        <div className="group">
          <span>{Group as string}</span>
        </div>
      )}
      <div className={className} id={message._id.slice(4, 12)} ref={FormRef}>
        <div className={formMessageClass} id={message._id.slice(4, 12)}>
          <div className="form-group">
            <div className="poll-question">
              <div className="poll-question-header">
                {message.timer && (
                  <div className="timer flex items-center gap-1">
                    <AccessTimeOutlinedIcon fontSize={"small"} />
                    <span className="text-sm">{message.timer + "s"}</span>
                  </div>
                )}
                {message.coin && (
                  <div className="coin-added flex items-center gap-1">
                    <MonetizationOnIcon fontSize="small" />
                    <span className="text-sm">{message.coin}</span>
                  </div>
                )}
              </div>
              <div className="text !p-2" id="question">
                {message.question}
              </div>
            </div>
            <div className="poll-options">
              <ul className="options">
                {message.options.map((option, i) => {
                  const optionClassName = `option${
                    Boolean(message?.answered) && option.checked
                      ? " correct"
                      : option.text === message.answered?.text
                      ? message.answered?.checked
                        ? " correct"
                        : " failed"
                      : ""
                  }`;

                  return (
                    <li className={optionClassName} key={i}>
                      <div className="form-group">
                        <input
                          type="radio"
                          name={option.text}
                          id="option"
                          readOnly
                          className="option"
                          checked={option.checked}
                        />
                      </div>
                      <div className="option-text capitalize label">
                        <label>{option.text}</label>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <span
            className={
              "time" +
              (message?.answered || message?.noAnswer
                ? " !text-white"
                : " text-gray-700")
            }
          >
            <small>{format(new Date(message.date), "HH:mm")}</small>
          </span>
          <div className="feedback">
            {Boolean(message?.answered)
              ? message.answered?.checked
                ? feedback.correct
                : feedback.failed
              : message?.noAnswer
              ? feedback.none
              : ""}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

var classJoin = " text-xs text-white text-center p-2 rounded-b-xl";
export const feedback = {
  correct: <div className={"correct bg-success" + classJoin}>Got it!</div>,
  none: <div className={"no-answer-picked bg-gold" + classJoin}>Timeout!</div>,
  failed: <div className={"failed bg-red-700" + classJoin}>Failed!</div>,
};

export default React.memo(OutgoingForm);
