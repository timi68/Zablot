/* eslint-disable @next/next/no-img-element */
import * as Interfaces from "@lib/interfaces";
import { emitCustomEvent } from "react-custom-events";

interface MatchedUserInterface {
  user: Interfaces.Matched;
  processFriend(id: string): void;
  processCancel(to?: string): void;
  processAdd(id?: String): void;
}

export default function MatchedUser(props: MatchedUserInterface) {
  const { user, processFriend, processCancel, processAdd } = props;
  return (
    <li className="user">
      <div className="user-profile">
        <div className="user-image">
          <img
            src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
            alt="user-image"
            className="image"
          />
        </div>
        <div className="user-name">
          <div className="name font-semibold">
            <span>{user.FullName}</span>
          </div>
          <div className="username font-semibold">
            <span>@{user.UserName}</span>
          </div>
        </div>
      </div>
      <div className="friend-reject-accept-btn btn-wrapper">
        {user?.rejected && (
          <button
            className="btn"
            disabled
            aria-disabled="true"
            aria-details="Displayed when friend request sent is rejected immediately"
          >
            <span>Request rejected</span>
          </button>
        )}

        {user.friends && (
          <button
            className="bg-green font-light hover:bg-opacity-90 rounded-3xl py-2 px-3 text-xs text-white"
            onClick={() => processFriend(user._id)}
          >
            <span>message</span>
          </button>
        )}
        {user?.sent && !user.friends && (
          <button
            className="cancel-btn btn !bg-green !bg-opacity-50 !py-2"
            onClick={(e) => {
              processCancel(user._id);
            }}
          >
            <span>Cancel request</span>
          </button>
        )}
        {!user?.sent && !user?.friends && !user?.rejected && (
          <button
            className="add-btn btn !bg-green !text-white !py-2"
            onClick={(e) => {
              processAdd(user._id);
            }}
          >
            <span>Add friend</span>
          </button>
        )}
      </div>
    </li>
  );
}
