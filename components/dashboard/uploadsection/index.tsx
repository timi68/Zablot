/* eslint-disable @next/next/no-img-element */
import React from "react";
import PollIcon from "@mui/icons-material/PollRounded";
import ImageIcon from "@mui/icons-material/ImageRounded";
import StyleIcon from "@mui/icons-material/StyleRounded";
import SendIcon from "@mui/icons-material/SendRounded";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ShareIcon from "@mui/icons-material/ShareRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import LoveIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Link from "next/link";
import { Avatar } from "@mui/material";
import { useAppSelector } from "@lib/redux/store";
import stringToColor from "@utils/stringToColor";
import { Divider } from "antd";
import Stories from "../Stories";
import Posts from "../Posts";

const stories = [];

function UploadScreen() {
  const user = useAppSelector((state) => state.sessionStore.user);

  return (
    <div>
      <div className="social-wrapper py-3">
        <Stories />
        <Divider className="my-[10px]" />
        <div className="upload create-post pt-0">
          <div className="form-group">
            <div className="text-box">
              <textarea
                name="writeups"
                id="writeups"
                placeholder="Write something..."
                className="text-control post-text"
              ></textarea>
              <div className="alternate-post">
                <Stack spacing={0.5} direction="row">
                  <IconButton size="small">
                    <ImageIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <PollIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <StyleIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </div>
              <div className="post-btn">
                <IconButton size="medium" className="icon">
                  <SendIcon />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
        <Posts />
      </div>
    </div>
  );
}

export default UploadScreen;
