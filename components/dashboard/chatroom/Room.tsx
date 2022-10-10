import React from "react";
import RoomHeader from "./RoomHeader";
import RoomBody from "./Room_body";
import { EntityId } from "@reduxjs/toolkit";
import RoomFooter from "./RoomFooter";

const Room = (props: { room_id: EntityId }) => {
  return (
    <div className="chats-form" id={String(props.room_id)}>
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
