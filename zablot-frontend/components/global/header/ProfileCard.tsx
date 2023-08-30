/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, Divider, IconButton } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import j from "jquery";
import { useAppSelector } from "@lib/redux/store";
import stringToColor from "@utils/stringToColor";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import Backdrop from "@comp/Backdrop";
import { variants } from "@lib/constants";

function ProfileCard() {
  const user = useAppSelector((s) => s.sessionStore.user);
  const [show, setShow] = React.useState(false);

  useCustomEventListener("toggle", (dest: string) => {
    setShow(dest == "p");
  });

  if (!user) return <></>;

  return (
    show && (
      <Backdrop open={setShow}>
        <div className="profile-link-wrapper">
          <motion.div {...variants} className="profile-expand">
            <div className="profile-header">
              <div className="text-center flex flex-col justify-center">
                <Avatar
                  src={user.image.profile}
                  sx={{
                    mx: "auto",
                    bgcolor: stringToColor(user?.firstName),
                  }}
                >
                  {user?.firstName.split(" ")[0][0] +
                    (user?.firstName.split(" ")[1]?.at(0) ?? "")}
                </Avatar>
                <div className="name">
                  <p className="user full-name font-bold">{user?.firstName}</p>
                  <div className="username font-semibold text-sm text-green">
                    @{user?.userName}
                  </div>
                </div>
                <div className="email">
                  <span className="text text-xs">{user?.email}</span>
                </div>
              </div>
            </div>
            <Divider />
            <div className="profile-body">
              <ul className="profile-list"></ul>
            </div>
          </motion.div>
        </div>
      </Backdrop>
    )
  );
}

export default ProfileCard;
