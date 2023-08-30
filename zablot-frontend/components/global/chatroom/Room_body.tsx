import React from "react";
import * as Interfaces from "@types";
import j from "jquery";
import { Socket } from "socket.io";
import axios from "axios";
import { Container, CircularProgress } from "@mui/material";
import OutgoingForm from "./OutgoingForm";
import IncomingForm from "./IncomingForm";
import IncomingImage from "./IncomingImage";
import OutgoingImage from "./OutgoingImage";
import { getRoom, updateRoom } from "@lib/redux/roomSlice";
import store, { useAppDispatch, useAppSelector } from "@lib/redux/store";
import Message from "./Message";

type MessagesResponse = {
  _id: string;
  Message: Interfaces.MessageType[];
};

const RoomBody: React.FC<{
  room_id: string | number;
}> = (props) => {
  // ----------------------------------------------

  const { room_id } = props;

  const socket = useAppSelector((state) => state.sessionStore.socket);
  const { messages, type, loaded, friend, fetched } = useAppSelector((state) =>
    getRoom(state, room_id)
  );
  const dispatch = useAppDispatch();
  const bodyRef = React.useRef<HTMLDivElement>();
  const Alert = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    if (loaded) {
      let { scrollTop, scrollHeight } = bodyRef.current;
      switch (type) {
        case "out":
        case "loaded":
          j(bodyRef.current).prop("scrollTop", bodyRef.current?.scrollHeight);
          break;
        case "in":
          if (scrollHeight - scrollTop > 500) {
            let downMessages = parseInt(Alert.current.innerText) + 1;
            j(Alert.current).text(downMessages).addClass("show");
          } else {
            bodyRef.current.scrollTo({
              top: scrollHeight,
              behavior: "smooth",
            });
          }
          break;
        default:
          break;
      }
    }
  }, [loaded, type, messages]);

  React.useEffect(() => {
    // if messages are not loaded and not fetched from the server
    // loaded means mounting the messages
    // fetched means fetching the messages from the server
    if (!loaded && !fetched) {
      (async () => {
        try {
          const response = await axios.post<MessagesResponse>("/api/messages", {
            _id: friend._id,
          });
          setTimeout(() => {
            dispatch(
              updateRoom({
                id: room_id,
                changes: {
                  messages: response?.data?.Message ?? [],
                  type: "loaded",
                  loaded: true,
                  fetched: true,
                },
              })
            );
          }, 300);
        } catch (error) {
          console.log({ error });
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          bodyRef.current.scrollTo({
            top: bodyRef.current.scrollHeight,
            behavior: "smooth",
          });
          j(Alert.current).text(0).removeClass("show");
        }}
      >
        0
      </div>
      {messages.map((message, i) => {
        return (
          <Assign
            key={message._id}
            room_id={room_id}
            message_id={message._id}
            message={message}
            friend={friend}
            next={true}
            pre={messages[i - 1]?.date}
          />
        );
      })}

      {!messages.length && (
        <div className="empty-messages">
          <div className="text">Be the first to send message</div>
        </div>
      )}
    </div>
  );
};

type AssignProps = {
  room_id: string | number;
  message_id: string;
  message: Interfaces.MessageType;
  friend: Interfaces.Friend;
  next?: boolean;
  pre: number;
};

const Assign = React.memo<AssignProps>(
  ({ next = true, message, friend, pre, room_id }) => {
    console.log("Assigned");
    let type: "in" | "out" = message.coming == friend.id ? "in" : "out";

    if (message.Format == "plain") {
      return <Message type={type} message={message} pre={new Date(pre)} />;
    }

    switch (message.coming) {
      case friend.id:
        switch (message.Format) {
          case "Form":
            return (
              <IncomingForm
                friend={friend}
                message={message}
                pre={new Date(pre)}
                room_id={room_id}
              />
            );
          case "image":
            return (
              <IncomingImage
                message={message}
                nextComingId={next}
                cur={new Date(message.date)}
                pre={new Date(pre)}
                i={1}
              />
            );
          default:
            return;
        }

      default:
        switch (message.Format) {
          case "Form":
            return (
              <OutgoingForm
                message={message}
                pre={new Date(pre)}
                room_id={room_id}
              />
            );
          case "image":
            return (
              <OutgoingImage
                message={message}
                nextGoingId={next}
                cur={new Date(message.date)}
                pre={new Date(pre)}
                room_id={room_id}
                i={1}
              />
            );
          default:
            return;
        }
    }
  }
);

Assign.displayName = "Assign";

export default RoomBody;
