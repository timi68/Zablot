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
        <CardActionArea
          className="chats_listItem list_item chat"
          role="listitem"
        >
          <div className="avatar user_image list_item" role="listitem">
            <Image
              src={"/images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"}
              alt={"Timi James"}
              layout="fill"
              role="img"
              className="image list_image"
            />
            <div className={`badge user_active_signal`} />
          </div>
          <div className="text" role="listitem">
            <div className="wrap">
              <div className="user_name primary_text">{"Timi James"}</div>
              <div className="unseenmessages badge">2</div>
            </div>
            <div className="last_message secondary_text">
              Where have you been, I have been looking for you every where
            </div>
          </div>
        </CardActionArea>
        <CardActionArea
          className="chats_listItem list_item chat"
          role="listitem"
        >
          <div className="avatar user_image list_item" role="listitem">
            <Image
              src={"/images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"}
              alt={"Timi James"}
              layout="fill"
              role="img"
              className="image list_image"
            />
            <div className={`badge user_active_signal`} />
          </div>
          <div className="text" role="listitem">
            <div className="wrap">
              <div className="user_name primary_text">{"Timi James"}</div>
              <div className="unseenmessages badge">2</div>
            </div>
            <div className="last_message secondary_text">
              Where have you been, I have been looking for you every where
            </div>
          </div>
        </CardActionArea>
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
