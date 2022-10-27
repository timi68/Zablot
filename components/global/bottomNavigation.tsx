import React from "react";
import { IconButton, Box, Avatar, Divider } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import stringToColor from "@utils/stringToColor";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import Link from "next/link";
import { RESIZE } from "@lib/redux/userSlice";
import { useRouter } from "next/router";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import NotificationsActive from "@mui/icons-material/NotificationsActive";

const MobileNavigation = () => {
  const [expand, setExpand] = React.useState("/");
  const { user, device } = useAppSelector((state) => state.sessionStore);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useCustomEventListener("off", () => {
    setExpand("/");
  });

  React.useEffect(() => {
    window.onresize = () => {
      let w = window.innerWidth;
      // alert("This is the width " + w);
      if (w < 650 && device !== "mobile") {
        dispatch(RESIZE("mobile"));
      } else if (w > 650 && w < 1000 && device !== "tablet") {
        dispatch(RESIZE("tablet"));
      } else if (w > 1000 && device !== "desktop") {
        dispatch(RESIZE("desktop"));
      }
    };
    return () => {
      window.onresize = null;
    };
  }, [device, dispatch, router]);

  if (!user || device !== "mobile") return <></>;

  const handleClick = (name: string) => {
    emitCustomEvent("toggle", name);
    setExpand(name);
  };

  const className = (n: string) => "open" + (n === expand ? " active" : "");

  return (
    <Box className="mobile sm:hidden z-[99999] nav fixed bottom-0 left-0 w-screen py-2 border border-gray-300 border-solid">
      {/* <Divider className="mb-4" /> */}
      <div className="flex justify-around items-center">
        {nav.map((button) => (
          <IconButton
            key={button.path}
            className={className(button.path)}
            onClick={() => handleClick(button.path)}
          >
            {button.icon}
          </IconButton>
        ))}
      </div>
    </Box>
  );
};

const nav = [
  {
    icon: <HomeIcon fontSize="small" />,
    path: "/",
  },
  {
    icon: <SearchRoundedIcon fontSize="small" />,
    path: "s",
  },
  {
    icon: <PersonAddIcon fontSize="small" />,
    path: "f",
  },
  {
    icon: <ChatRoundedIcon fontSize="small" />,
    path: "c",
  },
  {
    icon: <NotificationsActive fontSize="small" />,
    path: "n",
  },
];

export default React.memo(MobileNavigation);
