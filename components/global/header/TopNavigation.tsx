import React from "react";
import { Stack, IconButton, Badge } from "@mui/material";
import Coin from "@comp/coin";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import SearchIcon from "@mui/icons-material/Search";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import { useAppSelector } from "@lib/redux/store";

const TopNavigation = () => {
  const [expand, setExpand] = React.useState("");
  const { device, user } = useAppSelector((state) => state.sessionStore);

  const handleClick = (name: "n" | "f" | "p" | "s" | "c") => {
    emitCustomEvent("toggle", name);
    setExpand(name);
  };

  useCustomEventListener("off", () => {
    setExpand("");
  });

  const className = (n: string) => "open" + (n === expand ? " active" : "");
  return (
    <Stack direction="row" spacing={1.5} className="top-navigation flex-grow">
      <div
        className="search-container flex-grow"
        id="search"
        onClick={() => handleClick("s")}
      >
        <div className="search-form dummy">
          <div className="search-icon" role="search">
            <SearchIcon fontSize="small" />
          </div>
          <div className="form-control">
            <input
              type="search"
              role="searchbox"
              aria-autocomplete="none"
              className="text-control text-sm p-0"
              id="text-control"
              placeholder="Search a friend.."
              autoComplete="off"
            />
          </div>
        </div>
      </div>
      <Coin />
      <Badge color="secondary" showZero>
        <IconButton className={className("c")} onClick={() => handleClick("c")}>
          <ChatRoundedIcon fontSize="small" />
        </IconButton>
      </Badge>
      <Badge color="secondary" badgeContent={user.FriendRequests.length}>
        <IconButton className={className("f")} onClick={() => handleClick("f")}>
          <PersonAddIcon fontSize="small" />
        </IconButton>
      </Badge>
      <Badge color="default" badgeContent={0}>
        <IconButton className={className("n")} onClick={() => handleClick("n")}>
          <NotificationsActiveIcon fontSize="small" />
        </IconButton>
      </Badge>
      <IconButton
        size="medium"
        className={className("p")}
        onClick={() => handleClick("p")}
      >
        {expand === "p" ? (
          <ArrowDropUpIcon fontSize="medium" />
        ) : (
          <ArrowDropDownIcon fontSize="medium" />
        )}
      </IconButton>
    </Stack>
  );
};

export default TopNavigation;
