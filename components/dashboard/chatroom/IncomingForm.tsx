import React from "react";
import { RoomType, MessageType } from "../../../lib/interfaces";
import GroupMessage from "./Group_Message";
import { Socket } from "socket.io";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import Chip from "@mui/material/Chip";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import { getRoom } from "@lib/redux/roomSlice";
import { updateRoom } from "@lib/redux/roomSlice";
import store from "@lib/redux/store";

function OutgoingForm(props: {
  room_id: string | number;
  message: MessageType;
  nextComingId: boolean;
  cur: Date;
  pre: Date | null;
}) {
  const { room_id, nextComingId, message, cur, pre } = props;

  const [coming, socket, { _id: messagesId, Id: going }] = useAppSelector(
    (state) => [
      state.sessionStore.user._id,
      state.sessionStore.socket,
      getRoom(state, room_id).user,
    ]
  );
  const dispatch = useAppDispatch();
  const className = `incoming-message incoming-form ${
    nextComingId ? "adjust-mg" : ""
  }`;

  const Group = GroupMessage({ cur, pre });
  const UpdateState = (field: Partial<MessageType>) => {
    const messages = store
      .getState()
      .rooms.entities[room_id].messages.map((_message) => {
        if (_message._id === message._id) {
          return { ..._message, ...field };
        }
        return _message;
      });

    dispatch(
      updateRoom({
        id: room_id,
        changes: {
          messages,
          type: "in",
        },
      })
    );
  };

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
        UpdateState({ answered: OptionPicked });
        const pollCoinAdded: number = message.coin;
        const coinTagName: HTMLSpanElement =
          document.querySelector(".coin-wrapper span");

        if (pollCoinAdded) {
          var coin: number = parseInt(coinTagName.innerText);

          var count: number = 0;
          var interval: NodeJS.Timer = setInterval(() => {
            if (OptionPicked.checked) coin++;
            else coin--;

            coinTagName.innerText = coin as unknown as string;
            count++;

            if (count == pollCoinAdded) {
              clearInterval(interval);
            }
          }, 100);
        }
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

    socket.emit("NOANSWER", dataToEmit, (err: string, done: string) => {
      if (!err) {
        UpdateState({ noAnswer: true });
        const pollCoinAdded: number = message.coin;
        const coinTagName: HTMLSpanElement =
          document.querySelector(".coin-wrapper span");

        if (pollCoinAdded) {
          var coin: number = parseInt(coinTagName.innerText);

          var count: number = 0;
          var interval: NodeJS.Timer;
          interval = setInterval(() => {
            coin--;

            coinTagName.innerText = coin as unknown as string;
            count++;

            if (count == pollCoinAdded) {
              clearInterval(interval);
            }
          }, 100);
        }
      }
    });
  };

  const formMessageClass = `form-message poll question${
    (Boolean(message?.answered) &&
      (message.answered?.checked ? " correct before" : " failed before")) ??
    message?.noAnswer
      ? " no-answer-picked before"
      : ""
  }`;

  console.log({ message });

  return (
    <React.Fragment>
      {Group && (
        <div className="group">
          <span>{Group}</span>
        </div>
      )}
      <div className={className} id={message._id.slice(4, 12)}>
        <div className={formMessageClass} id={message._id.slice(4, 12)}>
          <div className="form-group">
            <div className="poll-question">
              <div className="poll-question-header">
                {Boolean(message.timer) &&
                  (!Boolean(message?.answered) ? (
                    <Timer timer={message.timer} PollTimeOut={PollTimeOut} />
                  ) : (
                    <div className="timer">
                      <Chip
                        className="time-count"
                        avatar={<AccessTimeOutlinedIcon fontSize="small" />}
                        label={message.timer + "s"}
                        variant="filled"
                      />
                    </div>
                  ))}
                {Boolean(message.coin) && (
                  <div className="coin-added">
                    <Chip
                      className="time-count"
                      avatar={<MonetizationOnIcon fontSize="small" />}
                      label={message.coin}
                      variant="filled"
                    />
                  </div>
                )}
              </div>
              <div className="text !mr-0" id="question">
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
                          readOnly={message.answered?.text ? true : false}
                          checked={message?.answered?.text === option.text}
                          onChange={() =>
                            message.answered?.text ? null : AnswerChecked(index)
                          }
                        />
                      </div>
                      <div className="option-text label">
                        <label>{option.text}</label>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <span className="time">
            <small>{format(cur, "HH:mm")}</small>
          </span>
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
      <div className="timer">
        <Chip
          className="time-count"
          avatar={<AccessTimeOutlinedIcon fontSize="small" />}
          label={time + "s"}
          variant="filled"
        />
      </div>
    );
  }
);
Timer.displayName = "Timer";

export default React.memo(OutgoingForm);
