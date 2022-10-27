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

const stories = [];

function UploadScreen() {
  const user = useAppSelector((state) => state.sessionStore.user);

  return (
    <div>
      <div className="social-wrapper py-3">
        <div className="feeds-container">
          <ul className="feeds-list flex px-2 gap-x-3 w-full overflow-auto">
            {user && (
              <li className="feed grid place-items-center">
                <div className="border rounded-full border-dashed border-slate-900 p-1">
                  <Avatar
                    src={user.Image.profile}
                    className="h-[50px] w-[50px]"
                    alt={user.FullName}
                    sx={{
                      bgcolor: stringToColor(user.FullName),
                    }}
                  >
                    {user.FullName.split(" ")[0][0] +
                      (user.FullName.split(" ")[1]?.at(0) ?? "")}
                  </Avatar>
                </div>

                <div className="status-label">
                  <span className="!font-['Nunito'] text-xs text-center font-bold">
                    You
                  </span>
                </div>
              </li>
            )}
            {[...(new Array(5).keys() as unknown as number[])].map((index) => {
              return (
                <li className="feed grid place-items-center" key={index}>
                  <div className="border rounded-full border-dashed border-slate-900 p-[3px]">
                    <Avatar
                      src={"./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"}
                      className="h-[50px] w-[50px]"
                      alt={user.FullName}
                      sx={{
                        bgcolor: stringToColor(user.FullName),
                      }}
                    >
                      {user.FullName.split(" ")[0][0] +
                        (user.FullName.split(" ")[1]?.at(0) ?? "")}
                    </Avatar>
                  </div>
                  <div className="status-label">
                    <span className="!font-['Nunito'] text-xs text-center">
                      {
                        [
                          "Tolu",
                          "Adeben",
                          "Sandra",
                          "Abigail",
                          "Fife",
                          "Jeje",
                          "Jagun",
                          "Razaq",
                          "Grace",
                          "Ayomi",
                          "CEO",
                          "Sanni",
                        ][Math.floor(Math.random() * 12) + 1]
                      }
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <Divider />
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
        <div className="posts-container uploads">
          <Stack
            spacing={3}
            divider={<Divider />}
            className="post-of-users general"
          >
            <li className="post each">
              <div className="post-wrapper flex p-2 gap-2">
                <Avatar
                  src={"./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"}
                  alt="John Oderinde Post"
                >
                  JH
                </Avatar>
                <div className="post-main">
                  <div className="username text-sm font-bold font-['Nunito']">
                    Oderinde James Oluwatimileyin
                  </div>
                  <div className="post-content">
                    <div className="post-text mb-2">
                      <div className="caption-text text-sm  font-['Nunito']">
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
                          <div className="image-content">
                            <img
                              src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
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
                      <span className="count">500</span>
                    </Button>
                    <Button
                      className="comments action action flex gap-1 items-center justify-center"
                      color="inherit"
                      id="comment"
                      fullWidth
                    >
                      <CommentIcon />
                      <span className="count">500</span>
                    </Button>
                    <Button
                      className="shares-counts action action flex gap-1 items-center justify-center"
                      color="inherit"
                      id="share"
                      fullWidth
                    >
                      <ShareIcon fontSize="small" />
                      <span className="count">500</span>
                    </Button>
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
                        <span className="comment text-xs">
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
                        className="text-control"
                      />
                      <div className="send-btn">
                        <IconButton size="small" className="btn send">
                          <SendIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </Stack>
        </div>
      </div>
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

export default UploadScreen;
