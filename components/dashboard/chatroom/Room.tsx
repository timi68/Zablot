import React from "react";
import RoomHeader from "./RoomHeader";
import RoomBody from "./Room_body";
import { EntityId } from "@reduxjs/toolkit";
import RoomFooter from "./RoomFooter";
import j from "jquery";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { useCustomEventListener } from "react-custom-events";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import { removeRoom } from "@lib/redux/roomSlice";

const Room = (props: { room_id: EntityId }) => {
  const chatForm = React.useRef<HTMLDivElement>(null);
  const [mount, setMount] = React.useState(false);
  const dispatch = useAppDispatch();
  const device = useAppSelector((state) => state.sessionStore.device);

  useCustomEventListener("RE_OPEN_CHAT", (id) => {
    if (props.room_id === id) {
      document.querySelector(".chat-rooms-wrapper").scrollTo({
        left: chatForm.current.offsetLeft - 20,
        behavior: "smooth",
      });
      j(chatForm.current).addClass("shake");

      setTimeout(() => {
        chatForm.current?.classList.remove("shake");
      }, 2000);
    }
  });

  useCustomEventListener("removeRoom", (room) => {
    if (props.room_id == room) {
      setMount(true);
    }
  });

  const variant = {
    exit: { left: "100vw" },
    animate: { left: 0 },
    initial: { left: "100vw" },
  };

  const transition: Transition = {
    type: "just",
  };

  return (
    <AnimatePresence onExitComplete={() => dispatch(removeRoom(props.room_id))}>
      {!mount && (
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
