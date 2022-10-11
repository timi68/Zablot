/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { motion } from "framer-motion";
import { IconButton } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import j from "jquery";
import { CSSTransition } from "react-transition-group";
import { useAppSelector } from "@lib/redux/store";

function ProfileCard() {
  const user = useAppSelector((s) => s.sessionStore.user);
  const [expand, setExpand] = React.useState(false);
  const IconButtonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div className="profile-link-wrapper">
      <IconButton
        size="medium"
        className="open"
        ref={IconButtonRef}
        onClick={(e) => {
          setExpand(!expand);
        }}
      >
        {expand ? (
          <ArrowDropUpIcon fontSize="medium" />
        ) : (
          <ArrowDropDownIcon fontSize="medium" />
        )}
      </IconButton>
      <CSSTransition timeout={200} in={expand} unmountOnExit>
        <motion.div
          animate={{
            opacity: 1,
          }}
          transition={{ duration: 0.2 }}
          className="profile-expand"
        >
          <div className="profile-header">
            <div className="profile_details">
              <div className="name">
                <p className="userfullname">{user?.FullName}</p>
                <div className="username">@{user?.UserName}</div>
              </div>
              <div className="email">
                <span className="text">{user?.Email}</span>
              </div>
            </div>
          </div>
          <div className="profile-body">
            <ul className="profile-list"></ul>
          </div>
        </motion.div>
      </CSSTransition>
    </div>
  );
}

export default ProfileCard;
