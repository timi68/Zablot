/* eslint-disable @next/next/no-img-element */
import React from "react";
import PollIcon from "@mui/icons-material/PollRounded";
import ImageIcon from "@mui/icons-material/ImageRounded";
import StyleIcon from "@mui/icons-material/StyleRounded";
import SendIcon from "@mui/icons-material/SendRounded";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { useAppSelector } from "@lib/redux/store";
import { Divider } from "antd";
import Stories from "../Stories";
import Posts from "../Posts";
import CreatePost from "./CreatePost";

const stories = [];

function UploadScreen() {
  const user = useAppSelector((state) => state.sessionStore.user);

  return (
    <div>
      <div className="social-wrapper py-3">
        <Stories />
        <Divider className="my-[10px]" />
        <CreatePost />
        <Posts />
      </div>
    </div>
  );
}

export default UploadScreen;
