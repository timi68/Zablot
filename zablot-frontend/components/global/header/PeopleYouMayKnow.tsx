import { Button } from "@mui/material";

export default function PeopleYouMightKnow() {
  return (
    <div className="related-friends friends">
      <div className="title">You might know this people</div>
      <ul className="users">
        <li className="user">
          <div className="user-profile">
            <div className="user-image">
              <div className="image-wrapper">
                <img
                  src="/images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
                  alt="user-image"
                  className="image"
                />
              </div>
            </div>
            <div className="user-name">
              <div className="name">
                <span>Timi James</span>
              </div>
              <div className="username">
                <span>@tjdbbs</span>
              </div>
            </div>
          </div>
          <div className="friend-reject-accept-btn btn-wrapper">
            <Button size="small" className="accept btn !bg-green text-white">
              <span className="accept-text ">Add</span>
            </Button>
            <Button
              size="small"
              className="reject btn button !bg-gradient-to-r from-red-200"
            >
              <span className="reject-text">Cancel</span>
            </Button>
          </div>
        </li>
      </ul>
    </div>
  );
}
