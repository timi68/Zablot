/* eslint-disable @next/next/no-img-element */
import * as Interfaces from "../../../lib/interfaces";

interface MatchedUserInterface {
  user: Interfaces.Matched;
  processFriend(
    user: Interfaces.Matched,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void;
  processCancel(to?: string): void;
  processAdd(id?: String): void;
}

export default function MatchedUser(props: MatchedUserInterface) {
  const { user, processFriend, processCancel, processAdd } = props;
  return (
    <li className="user">
      <div className="user-profile">
        <div className="user-image">
          <div className="image-wrapper">
            <img
              src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
              alt="user-image"
              className="image"
            />
          </div>
        </div>
        <div className="user-name">
          <div className="name">
            <span>{user.FullName}</span>
          </div>
          <div className="username">
            <span>@{user.UserName}</span>
          </div>
        </div>
      </div>
      <div className="friend-reject-accept-btn btn-wrapper">
        {user?.rejected && (
          <button
            className="message-btn btn"
            disabled
            aria-disabled="true"
            aria-details="Displayed when friend request sent is rejected immediately"
          >
            <span>Request rejected</span>
          </button>
        )}

        {user.friends && (
          <button
            className="message-btn btn"
            onClick={(e) => {
              processFriend(user, e);
            }}
          >
            <span>message</span>
          </button>
        )}
        {user?.sent && (
          <button
            className="cancel-btn btn"
            onClick={(e) => {
              processCancel(user._id);
            }}
          >
            <span>Cancel request</span>
          </button>
        )}
        {!user?.sent && !user?.friends && !user?.rejected && (
          <button
            className="add-btn btn"
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
