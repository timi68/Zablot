import React from "react";
import { RoomType, MessageType, Friend } from "@types";
import GroupMessage from "@lib/Group_Message";
import { Socket } from "socket.io";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import Chip from "@mui/material/Chip";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import { UpdateState } from "@lib/redux/store";
import { isEqual } from "lodash";
import { emitCustomEvent } from "react-custom-events";
import { feedback } from "./OutgoingForm";

function IncomingForm(props: {
  room_id: string | number;
  friend: Friend;
  message: MessageType;
  pre: Date | null;
}) {
  const { room_id, friend, message, pre } = props;
  const { _id: coming, socket } = useAppSelector((state) => state.sessionStore);
  const { _id: messagesId, Id: going } = friend;
  const dispatch = useAppDispatch();
  const className = `incoming-message incoming-form`;

  const Group = GroupMessage({ cur: new Date(message.date), pre });

  /**
   *
   * this function that is called when user pick an option
   */
  const AnswerChecked = (index: number) => {
    const OptionPicked = message.options[index];
    const CorrectAnswer = message.options.find((option) => option.checked);

    const dataToEmit = {
      OptionPicked,
      CorrectAnswer,
      messageId: message._id,
      messagesId,
      going,
      coming,
      coin: message.coin,
    };

    // This will send a emitter to the server that a poll has been answered
    // and get a response from the server if process is done
    socket.emit("ANSWERED", dataToEmit, (err: string, _done: string) => {
      if (!err) {
        UpdateState({ answered: OptionPicked }, dispatch, room_id, message._id);

        let action = isEqual(OptionPicked, CorrectAnswer) ? "add" : "less";
        emitCustomEvent("coin", { num: message.coin, action });
      }
    });
  };

  const PollTimeOut = (): void => {
    const dataToEmit = {
      messageId: message._id,
      messagesId,
      going,
      coming,
      coin: message.coin,
    };

    socket.emit("NOANSWER", dataToEmit, (err: string) => {
      if (!err) {
        UpdateState({ noAnswer: true }, dispatch, room_id, message._id);
        emitCustomEvent("coin", { num: message.coin, action: "less" });
      }
    });
  };

  const formMessageClass = `form-message poll question`;

  return (
    <React.Fragment>
      {Group && (
        <div className="group">
          <span>{Group as string}</span>
        </div>
      )}
      <div className={className} id={message._id.slice(4, 12)}>
        <div className={formMessageClass} id={message._id.slice(4, 12)}>
          <div className="form-group">
            <div className="poll-question">
              <div className="poll-question-header">
                {Boolean(message.timer) &&
                  (!message?.answered && !message?.noAnswer ? (
                    <Timer timer={message.timer} PollTimeOut={PollTimeOut} />
                  ) : (
                    <div className="timer flex items-center gap-1">
                      <AccessTimeOutlinedIcon fontSize={"small"} />
                      <span className="text-sm">{message.timer + "s"}</span>
                    </div>
                  ))}
                {Boolean(message.coin) && (
                  <div className="flex items-center gap-1">
                    <MonetizationOnIcon fontSize="small" />
                    <span className="text-sm">{message.coin}</span>
                  </div>
                )}
              </div>
              <div className="text !mr-0 !p-2 capitalize" id="question">
                {message.question}
              </div>
            </div>
            <div className="poll-options">
              <ul className="options">
                {message.options.map((option, index) => {
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
                    <li className={optionClassName} key={index}>
                      <div className="form-group">
                        <input
                          type="radio"
                          name={option.text}
                          id="option"
                          className="option"
                          readOnly={
                            message.answered?.text || message.noAnswer
                              ? true
                              : false
                          }
                          checked={message?.answered?.text === option.text}
                          onChange={() =>
                            message.answered?.text || message.noAnswer
                              ? null
                              : AnswerChecked(index)
                          }
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

const Timer: React.FC<{ timer: number; PollTimeOut(): void }> = React.memo(
  ({
    timer,
    PollTimeOut,
  }: {
    timer: number;
    PollTimeOut(): void;
  }): JSX.Element => {
    const [time, setTime] = React.useState<number>(timer);

    React.useEffect(() => {
      var timeout: NodeJS.Timeout;
      if (time > 0) {
        timeout = setTimeout(() => {
          setTime(time - 1);
        }, 1000);
      } else {
        PollTimeOut();
      }

      return () => {
        clearTimeout(timeout);
      };
    }, [time, PollTimeOut]);
    return (
      <div className="timer flex items-center gap-1">
        <AccessTimeOutlinedIcon fontSize={"small"} />
        <span className="text-sm">{time + "s"}</span>
      </div>
    );
  }
);
Timer.displayName = "Timer";

export default React.memo(IncomingForm);
