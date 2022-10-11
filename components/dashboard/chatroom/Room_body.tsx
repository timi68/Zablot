import React from "react";
import * as Interfaces from "../../../lib/interfaces";
import IncomingMessage from "./IncomingMessage";
import OutgoingMessage from "./OutgoingMessage";
import j from "jquery";
import { Socket } from "socket.io";
import axios from "axios";
import { Container, CircularProgress } from "@mui/material";
import OutgoingForm from "./OutgoingForm";
import IncomingForm from "./IncomingForm";
import IncomingImage from "./IncomingImage";
import OutgoingImage from "./OutgoingImage";
import { emitCustomEvent } from "react-custom-events";
import { getRoom, updateRoom } from "@lib/redux/roomSlice";
import store, { useAppDispatch, useAppSelector } from "@lib/redux/store";
import { loadDefaultErrorComponents } from "next/dist/server/load-components";

const RoomBody: React.FC<{
  room_id: string | number;
}> = (props) => {
  // ----------------------------------------------

  const { room_id } = props;

  const socket = useAppSelector((state) => state.sessionStore.socket);
  const { messages, type, loaded, user } = useAppSelector((state) =>
    getRoom(state, room_id)
  );
  const coming = useAppSelector((state) => state.sessionStore.user._id);
  const dispatch = useAppDispatch();
  const bodyRef = React.useRef<HTMLDivElement>();
  const Alert = React.useRef<HTMLDivElement>();

  const _callback$Incoming = React.useCallback(
    (message: Interfaces.MessageType) => {
      if (message.coming !== user.Id) return;
      const messages = store.getState().rooms.entities[room_id].messages;
      dispatch(
        updateRoom({
          id: room_id,
          changes: {
            messages: [...messages, message],
            type: "in",
          },
        })
      );
    },
    [dispatch, room_id, user]
  );

  const _callback$Answered = React.useCallback(
    (data: { coming: string; answer: { text: string; checked: boolean } }) => {
      if (data.coming !== user.Id) return;
    },
    [user]
  );

  React.useEffect(() => {
    // setMessageData({messages: y, type: "loaded"});
    if (loaded) {
      switch (type) {
        case "out":
        case "loaded":
          j(bodyRef.current).animate(
            {
              scrollTop: bodyRef.current.scrollHeight,
            },
            "slow"
          );
          break;
        case "in":
          let scrollTop = bodyRef.current.scrollTop;
          let scrollHeight = bodyRef.current.scrollHeight;

          if (scrollHeight - scrollTop > 200) {
            let downMessages = parseInt(Alert.current.innerText) + 1;
            j(Alert.current).text(downMessages).addClass("show");
          }
          break;
        default:
          break;
      }
    }
  }, [loaded, type]);

  React.useEffect(() => {
    // Socket handler; socket listener set when each group in created
    // they are also removed when user close the room
    socket.on("INCOMINGMESSAGE", _callback$Incoming);
    socket.on("INCOMINGFORM", _callback$Incoming);
    socket.on("ANSWERED", _callback$Answered);

    return () => {
      // All this listener will be off when the user close
      // the chat room
      socket.off("INCOMINGMESSAGE", _callback$Incoming);
      socket.off("INCOMINGFORM", _callback$Incoming);
      socket.off("ANSWERED", _callback$Answered);
    };
  }, [_callback$Answered, _callback$Incoming, dispatch, socket]);

  React.useEffect(() => {
    if (!loaded) {
      (async () => {
        try {
          const response = await axios.post<{
            _id: string;
            Message: Interfaces.MessageType[];
          }>("/api/messages", {
            _id: user._id,
          });
          console.log({ response: response.data });
          dispatch(
            updateRoom({
              id: room_id,
              changes: {
                messages: response?.data?.Message ?? [],
                type: "loaded",
                loaded: true,
              },
            })
          );
        } catch (error) {
          console.log({ error });
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log({ messages });

  if (!loaded) {
    return (
      <div className="room-body">
        <Container
          sx={{
            height: "100%",
            width: "100%",
            display: "grid",
            placeItems: "center",
          }}
        >
          <CircularProgress size={30} thickness={3} />
        </Container>
      </div>
    );
  }

  return (
    <div className="room-body" ref={bodyRef}>
      <div className="welcome-message">
        <div className="message">
          <span>You are now connected</span>
        </div>
      </div>
      <div
        className="alert-message"
        ref={Alert}
        onClick={() => {
          j(bodyRef.current).animate(
            {
              scrollTop: bodyRef.current?.scrollHeight,
            },
            "slow"
          );
        }}
      >
        0
      </div>
      {messages.map((data, i) => {
        const nextComingId: boolean =
          i > 0 && i < messages.length - 1
            ? messages[i + 1].coming === data.coming
            : false;

        const nextGoingId =
          i > 0 && i < messages.length - 1
            ? messages[i + 1].going === data.going
            : false;

        const cur: Date = new Date(data.date);
        const pre: Date | null = i > 0 ? new Date(messages[i - 1].date) : null;

        switch (data.coming) {
          case user.Id:
            switch (data.Format) {
              case "Form":
                return (
                  <IncomingForm
                    message={data}
                    key={i}
                    nextComingId={nextComingId}
                    cur={cur}
                    pre={pre}
                    room_id={room_id}
                  />
                );
              case "plain":
                return (
                  <IncomingMessage
                    message={data}
                    key={i}
                    nextComingId={nextComingId}
                    cur={cur}
                    pre={pre}
                    i={i}
                  />
                );
              case "image":
                return (
                  <IncomingImage
                    message={data}
                    key={i}
                    nextComingId={nextComingId}
                    cur={cur}
                    pre={pre}
                    i={i}
                  />
                );
              default:
                return;
            }

          default:
            switch (data.Format) {
              case "Form":
                return (
                  <OutgoingForm
                    key={i}
                    message={data}
                    nextGoingId={nextGoingId}
                    cur={cur}
                    pre={pre}
                    i={i}
                    room_id={room_id}
                  />
                );
              case "plain":
                return (
                  <OutgoingMessage
                    key={i}
                    message={data}
                    nextGoingId={nextGoingId}
                    cur={cur}
                    pre={pre}
                    i={i}
                  />
                );
              case "image":
                return (
                  <OutgoingImage
                    key={i}
                    message={data}
                    nextGoingId={nextComingId}
                    cur={cur}
                    pre={pre}
                    room_id={room_id}
                    i={i}
                  />
                );
              default:
                return;
            }
        }
      })}

      {!messages.length && (
        <div className="empty-messages">
          <div className="text">Be the first to send message</div>
        </div>
      )}
    </div>
  );
};

export default RoomBody;
