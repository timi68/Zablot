/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { MessageType } from "../../../lib/interfaces";
import GroupMessage from "./Group_Message";
import { Socket } from "socket.io";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import Chip from "@mui/material/Chip";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import store from "@lib/redux/store";
import { updateRoom } from "@lib/redux/roomSlice";

type DataType = {
  messageId: string;
  OptionPicked: { text: string; checked: boolean };
};

function OutgoingForm(props: {
  message: MessageType;
  nextGoingId: boolean;
  cur: Date;
  pre: Date | null;
  room_id: string | number;
}) {
  const { nextGoingId, message, cur, pre, room_id } = props;

  const socket = useAppSelector((state) => state.sessionStore.socket);

  const dispatch = useAppDispatch();
  const FormRef = React.useRef<HTMLDivElement>(null);
  const Group = GroupMessage({ cur, pre });

  const UpdateState = React.useCallback(
    (field: Partial<MessageType>) => {
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
    },
    [dispatch, message, room_id]
  );

  const _callback$Answered = React.useCallback(
    (data: DataType) => {
      UpdateState({ answered: data.OptionPicked });

      const pollCoinAdded: number = message.coin;
      const coinTagName: HTMLSpanElement =
        document.querySelector(".coin-wrapper span");

      if (pollCoinAdded) {
        var coin: number = parseInt(coinTagName.innerText);

        var count: number = 0;
        var interval: NodeJS.Timer = setInterval(() => {
          if (data.OptionPicked.checked) coin--;
          else coin++;

          coinTagName.innerText = coin as unknown as string;
          count++;

          if (count == pollCoinAdded) {
            clearInterval(interval);
          }
        }, 100);
      }
    },
    [UpdateState, message.coin]
  );

  const _callback$NoAnswer = React.useCallback(
    (data: DataType) => {
      UpdateState({ noAnswer: true });

      const pollCoinAdded: number = message.coin;
      const coinTagName: HTMLSpanElement =
        document.querySelector(".coin-wrapper span");

      if (pollCoinAdded) {
        var coin: number = parseInt(coinTagName.innerText);

        var count: number = 0;
        var interval: NodeJS.Timer;
        interval = setInterval(() => {
          coin++;

          coinTagName.innerText = coin as unknown as string;
          count++;

          if (count == pollCoinAdded) {
            clearInterval(interval);
          }
        }, 100);
      }
    },
    [UpdateState, message.coin]
  );

  React.useLayoutEffect(() => {
    if (socket) {
      socket.on("ANSWERED", _callback$Answered);
      socket.on("NOANSWER", _callback$NoAnswer);
    }

    if (Boolean(message?.answered)) {
      if (FormRef.current) {
        FormRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }

    return () => {
      if (socket) {
        socket.off("ANSWERED", _callback$Answered);
        socket.on("NOANSWER", _callback$NoAnswer);
      }
    };
  }, [_callback$Answered, _callback$NoAnswer, message?.answered, socket]);

  const className = `outgoing-message outgoing-form${
    nextGoingId ? " adjust-mg" : ""
  } `;
  const formMessageClass = `form-message poll question${
    Boolean(message?.answered)
      ? message.answered?.checked
        ? " correct before"
        : " failed before"
      : message?.noAnswer
      ? " no-answer-picked before"
      : ""
  }`;

  return (
    <React.Fragment>
      {Group && (
        <div className="group">
          <span>{Group}</span>
        </div>
      )}
      <div className={className} id={message._id.slice(4, 12)} ref={FormRef}>
        <div className={formMessageClass} id={message._id.slice(4, 12)}>
          <div className="form-group">
            <div className="poll-question">
              <div className="poll-question-header">
                {message.timer && (
                  <div className="timer">
                    <Chip
                      className="time-count"
                      avatar={<AccessTimeOutlinedIcon fontSize="small" />}
                      label={message.timer}
                      variant="filled"
                    />
                  </div>
                )}
                {message.coin && (
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
              <div className="text" id="question">
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

export default React.memo(OutgoingForm);
