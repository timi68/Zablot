/* eslint-disable @next/next/no-img-element */
import React from "react";
import SendIcon from "@mui/icons-material/SendRounded";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ShareIcon from "@mui/icons-material/ShareRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import LoveIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Link from "next/link";
import { Avatar } from "@mui/material";
import { Divider } from "antd";
import stringToColor from "@utils/stringToColor";

const posts = [
  {
    _id: 1,
    user: {
      _id: 1,
      name: "Timi James",
      image: "",
    },
    caption: "",
    medias: ["./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"],
    likes: 300,
    comments: 5000,
    share: 10,
    type: "media",
    poll: {},
  },
  {
    _id: 2,
    user: {
      _id: 2,
      name: "Ajoke Toluwa",
      image: "",
    },
    caption: "",
    medias: ["/images/online-study.png"],
    likes: 3030,
    comments: 15000,
    share: 1000,
    type: "media",
    poll: {},
  },
];

function Posts() {
  return (
    <div className="posts-container uploads">
      <Stack
        spacing={3}
        divider={<Divider />}
        className="post-of-users general"
      >
        {posts.map((post, i) => {
          return (
            <li className="post each p-2" key={post._id}>
              <div className="post-wrapper flex gap-2">
                <Avatar
                  src={post.user.image}
                  sx={{
                    width: 40,
                    height: 40,
                    fontSize: "14px",
                    bgcolor: stringToColor(post.user.name),
                  }}
                >
                  {post.user.name.split(" ")[0][0] +
                    (post.user.name.split(" ")[1]?.at(0) ?? "")}
                </Avatar>
                <div className="post-main">
                  <div className="username text-sm font-bold font-['Nunito']">
                    {post.user.name}
                  </div>
                  <div className="post-content">
                    <div className="post-text mb-2">
                      <div className="caption-text text-xs font-['Nunito']">
                        Lorem ipsum dolor sit amet
                        <Link href="#" passHref>
                          <a className="tags"> @tj-dibbs</a>
                        </Link>{" "}
                        consectetur adipisicing elit. Quo, mollitia tempora
                        delectus repudiandae eum iste!
                      </div>
                    </div>
                  </div>
                  <div className="post-media">
                    <div className="swiper-container">
                      <div className="swiper-wrapper">
                        <div className="swiper-slide">
                          <div className="image-content bg-[#e5e2e2] rounded-xl">
                            <img
                              src={post.medias[0]}
                              alt=""
                              className="image w-full rounded-xl overflow-hidden"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="post-actions feedback flex justify-around">
                    <Button
                      className="likes-count action flex gap-1 items-center justify-center"
                      color="inherit"
                      id="thumb"
                      fullWidth
                    >
                      <LoveIcon fontSize="small" />
                      <span className="count">{post.likes}</span>
                    </Button>
                    <Button
                      className="comments action action flex gap-1 items-center justify-center"
                      color="inherit"
                      id="comment"
                      fullWidth
                    >
                      <CommentIcon />
                      <span className="count">{post.comments}</span>
                    </Button>
                    <Button
                      className="shares-counts action action flex gap-1 items-center justify-center"
                      color="inherit"
                      id="share"
                      fullWidth
                    >
                      <ShareIcon fontSize="small" />
                      <span className="count">{post.share}</span>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="fast-comment-box">
                <div className="recent-comment mb-2">
                  <div className="user">
                    <Avatar
                      src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
                      alt=""
                      className="h-8 w-8"
                    />
                    <span className="name text-sm">Davido Adeniyi</span>
                    <span className="text-xs font-['Nunito']">
                      What is wrong with you &#128513; &#128513;
                    </span>
                  </div>
                </div>
                <div className="comment-create-box input-box relative rounded-lg flex items-center p-[5px]">
                  <IconButton size="small" className="icon media-icon">
                    <LinkRoundedIcon fontSize="small" />
                  </IconButton>
                  <textarea
                    placeholder="Type a message.."
                    name="message"
                    id="text-control"
                    className="text-control py-[5.5px]"
                  />
                  <div className="send-btn">
                    <IconButton size="small" className="btn send">
                      <SendIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </Stack>
    </div>
  );
}

const CommentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 50 50"
  >
    <path
      fill="currentColor"
      d="M15 42h-2l1.2-1.6c.8-1.1 1.3-2.5 1.6-4.2C10.8 33.9 8 29.6 8 24c0-8.6 6.5-14 17-14s17 5.4 17 14c0 8.8-6.4 14-17 14h-.7c-1.6 1.9-4.4 4-9.3 4zm10-30c-9.4 0-15 4.5-15 12c0 6.4 3.9 9.4 7.2 10.7l.7.3l-.1.8c-.2 1.6-.5 3-1.1 4.2c3.3-.4 5.2-2.1 6.3-3.5l.3-.4H25c13.5 0 15-8.4 15-12C40 16.5 34.4 12 25 12z"
    />
  </svg>
);

export default Posts;
