/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import * as Interfaces from "@lib/interfaces";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import Room from "./Room";
import { nanoid } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import { addRoom, getRoomIds } from "@lib/redux/roomSlice";

const ChatRoom = () => {
  const rooms = useAppSelector(getRoomIds);
  const _id = useAppSelector((state) => state.sessionStore.user._id);
  const dispatch = useAppDispatch();

  useCustomEventListener(
    "openRoom",
    ({ user, target }: { user: Interfaces.Friend; target: HTMLDivElement }) => {
      if (rooms.includes(user.Id)) {
        emitCustomEvent("RE_OPEN_CHAT", user.Id);
        return;
      }
      let roomData: Interfaces.RoomType = {
        room_id: user.Id,
        user,
        messages: [],
        target,
        loaded: false,
        pollData: {
          question: "",
          options: [
            { text: "", checked: false },
            { text: "", checked: false },
          ],
          Format: "Form",
          _id: user._id,
          coming: _id,
          going: user.Id,
        },
        pollToggled: false,
      };
      dispatch(addRoom(roomData));
      // setRooms((prev): Interfaces.RoomType[] => {
      //   return [...prev, roomData];
      // });
    }
  );

  return (
    <div className="chat-rooms-container">
      <div className="chat-rooms-wrapper">
        {rooms?.map((room, i) => {
          return <Room key={room} room_id={room} />;
        })}
      </div>
    </div>
  );
};

export default ChatRoom;
