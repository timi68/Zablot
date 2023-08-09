import React from "react";
import RoomHeader from "./RoomHeader";
import RoomBody from "./Room_body";
import { EntityId } from "@reduxjs/toolkit";
import RoomFooter from "./RoomFooter";
import j from "jquery";
import {
  motion,
  AnimatePresence,
  Transition,
  AnimationControls,
  TargetAndTransition,
  Variants,
} from "framer-motion";
import { useCustomEventListener } from "react-custom-events";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import { removeRoom, updateRoom } from "@lib/redux/roomSlice";
import * as Interfaces from "@types";
import store from "@lib/redux/store";

const Room = (props: { room_id: EntityId }) => {
  const chatForm = React.useRef<HTMLDivElement>(null);
  // const [mount, setMount] = React.useState(false);
  const dispatch = useAppDispatch();
  const closed = useAppSelector(
    (state) => state.rooms.entities[props.room_id].closed
  );
  const { device, socket } = useAppSelector((state) => state.sessionStore);

  const _callback$Incoming = React.useCallback(
    (message: Interfaces.MessageType) => {
      if (message.coming !== props.room_id) return;
      const messages = store.getState().rooms.entities[props.room_id].messages;
      dispatch(
        updateRoom({
          id: props.room_id,
          changes: {
            messages: [...messages, message],
            type: "in",
          },
        })
      );
    },
    [dispatch, props.room_id]
  );

  React.useLayoutEffect(() => {
    if (device === "mobile") {
      closed
        ? j(".chat-rooms-container").css("visibility", "hidden")
        : j(".chat-rooms-container").removeAttr("style");
    }
  }, [closed, device]);

  React.useEffect(() => {
    // Socket handler; socket listener set when each group in created
    // they are also removed when friend close the room
    socket.on("INCOMINGMESSAGE", _callback$Incoming);
    socket.on("INCOMINGFORM", _callback$Incoming);

    return () => {
      // All this listener will be off when the friend close
      // the chat room
      socket.off("INCOMINGMESSAGE", _callback$Incoming);
      socket.off("INCOMINGFORM", _callback$Incoming);
    };
  }, [_callback$Incoming, dispatch, socket]);

  useCustomEventListener(
    "RE_OPEN_CHAT",
    (id) => {
      if (props.room_id === id) {
        if (closed) {
          dispatch(
            updateRoom({ id: props.room_id, changes: { closed: false } })
          );
          return;
        }
        document.querySelector(".chat-rooms-wrapper").scrollTo({
          left: chatForm.current.offsetLeft - 20,
          behavior: "smooth",
        });
        j(chatForm.current).addClass("shake");

        setTimeout(() => {
          chatForm.current?.classList.remove("shake");
        }, 2000);
      }
    },
    [closed]
  );

  useCustomEventListener("removeRoom", (room) => {
    if (props.room_id == room) {
      dispatch(
        updateRoom({
          id: props.room_id,
          changes: { closed: true, type: "loaded" },
        })
      );
    }
  });

  const variant: Variants = {
    exit: { x: "100vw" },
    animate: { x: 0 },
    initial: { x: "100vw" },
  };

  const transition: Transition = {
    type: "just",
  };

  return (
    <AnimatePresence
      onExitComplete={() => {
        dispatch(updateRoom({ id: props.room_id, changes: { closed: true } }));
        if (device === "mobile") {
          j(".chat-rooms-container").css({
            visibility: "hidden",
            pointerEvent: "none",
          });
        }
      }}
    >
      {!closed && (
        <motion.div
          layout
          transition={transition}
          {...variant}
          className="chats-form"
          id={String(props.room_id)}
          ref={chatForm}
        >
          <div
            className="image-preview-wrapper application"
            role="application"
          ></div>
          <div
            className="video-preview-wrapper application"
            role="application"
          ></div>
          <div className="form-group chats-room">
            <RoomHeader room_id={props.room_id} />
            <RoomBody room_id={props.room_id} />
            <RoomFooter room_id={props.room_id} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(Room);
