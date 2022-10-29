import React from "react";
import {
  AppBar,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Skeleton,
} from "@mui/material";
import TopNavigation from "@comp/TopNavigation";
import { useAppSelector } from "@lib/redux/store";
import UploadScreen from "@comp/dashboard/uploadsection";
import ChatRoom from "@comp/global/chatroom";
import Coin from "@comp/coin";
import stringToColor from "@utils/stringToColor";
import { emitCustomEvent } from "react-custom-events";

function Header() {
  const { user, device } = useAppSelector((state) => state.sessionStore);

  if (!user) {
    return (
      <div className="main-header">
        <Skeleton variant="rounded" className="w-full h-full" />
      </div>
    );
  }

  return device != "mobile" ? (
    <AppBar position="sticky" className="header">
      <div className="toolbar">
        <Typography
          component="h2"
          variant="h5"
          color="primary"
          className="logo title display-large"
          sx={{
            fontWeight: 700,
            fontFamily: "Poppins !important",
          }}
        >
          Zablot
        </Typography>
        <TopNavigation />
      </div>
    </AppBar>
  ) : (
    <div className="mobile-header sm:hidden sticky top-0 bg-whitesmoke z-10">
      <div className="flex justify-between p-3">
        <Typography
          variant="h5"
          color="primary"
          className="logo title display-large"
          sx={{
            fontWeight: 700,
            fontFamily: "Poppins !important",
          }}
        >
          Zablot
        </Typography>
        <div className="wrap">
          <Coin />
          <IconButton
            className="open ml-3"
            onClick={() => emitCustomEvent("side")}
          >
            <Avatar
              src={user.Image.profile}
              sx={{
                width: 25,
                height: 25,
                pt: "1px",
                fontSize: ".8rem",
                bgcolor: stringToColor(user.FullName),
              }}
            >
              {user.FullName.split(" ")[0][0] +
                (user.FullName.split(" ")[1]?.at(0) ?? "")}
            </Avatar>
          </IconButton>
        </div>
      </div>
      <Divider />
    </div>
  );
}

export default Header;
