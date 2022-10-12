import React from "react";
import RoomHeader from "./RoomHeader";
import RoomBody from "./Room_body";
import { EntityId } from "@reduxjs/toolkit";
import RoomFooter from "./RoomFooter";
import j from "jquery";
import { useCustomEventListener } from "react-custom-events";

const Room = (props: { room_id: EntityId }) => {
  const chatForm = React.useRef<HTMLDivElement>(null);

  useCustomEventListener("RE_OPEN_CHAT", (id) => {
    if (props.room_id === id) {
      j(chatForm.current).addClass("shake");
      chatForm.current.scrollIntoView();

      setTimeout(() => {
        chatForm.current.classList.remove("shake");
      }, 2000);
    }
  });

  return (
    <div className="chats-form" id={String(props.room_id)} ref={chatForm}>
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
    </div>
  );
};

export default React.memo(Room);
