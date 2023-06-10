/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import * as Interfaces from "@lib/interfaces";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import Room from "./Room";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import { addRoom, getRoomIds } from "@lib/redux/roomSlice";
import { AnimateSharedLayout, motion } from "framer-motion";

const ChatRoom = () => {
  const rooms = useAppSelector(getRoomIds);
  const device = useAppSelector((state) => state.sessionStore.device);
  const dispatch = useAppDispatch();

  useCustomEventListener(
    "openRoom",
    ({ friend }: { friend: Interfaces.Friend }) => {
      if (rooms.includes(friend.Id)) {
        emitCustomEvent("RE_OPEN_CHAT", friend.Id);
        return;
      }
      let roomData: Interfaces.RoomType = {
        room_id: friend.Id,
        friend,
        messages: [],
        loaded: false,
        fetched: false,
      };
      dispatch(addRoom(roomData));
    }
  );

  return (
    Boolean(rooms.length) && (
      <div
        className={
          "chat-rooms-container sm:z-[10] max-w-[100vw] overflow-x-auto " +
          (device == "mobile"
            ? "top-0 h-screen w-screen left-0 z-[9999999] fixed"
            : "right-0 -translate-x-1/2 bottom-2.5 absolute")
        }
      >
        <AnimateSharedLayout>
          <motion.div className="chat-rooms-wrapper">
            {rooms?.map((room, i) => {
              return <Room key={room} room_id={room} />;
            })}
          </motion.div>
        </AnimateSharedLayout>
      </div>
    )
  );
};

export default ChatRoom;
