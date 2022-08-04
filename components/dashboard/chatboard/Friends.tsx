import React from "react";
import Chats from "./Chats";
import * as Interface from "../../../lib/interfaces";
import Image from "next/image";
import CardActionArea from "@mui/material/CardActionArea";
/*
 * @param {{friends: Object[]}} props
 * @returns
 */

interface props {
  friends: Interface.Friends[];
  openRoom(
    user: Interface.Friends,
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ): void;
  friendId: string;
}

function Friends(props: props) {
  const { friendId, friends, openRoom } = props;
  const NotPrivateFriends = friends?.filter((friend) => !friend.IsPrivate);
  return (
    <div className="friends_chats chats_listbox" role="listbox">
      <ul className="chats-list list" role="list">
        {NotPrivateFriends?.map((user, index) => {
          return (
            <Chats
              key={index}
              friendId={friendId}
              open={openRoom}
              user={user}
            />
          );
        })}
        {!friends?.length && (
          <div className="no-friend-available">
            <div className="text">
              <span>You dont have any friend</span>
            </div>
          </div>
        )}
      </ul>
    </div>
  );
}

export default Friends;
