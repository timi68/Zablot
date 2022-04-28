/* eslint-disable @next/next/no-img-element */
import React from "react";
import PollIcon from "@mui/icons-material/PollRounded";
import ImageIcon from "@mui/icons-material/ImageRounded";
import StyleIcon from "@mui/icons-material/StyleRounded";
import SendIcon from "@mui/icons-material/SendRounded";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ThumbIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/CommentRounded";
import ShareIcon from "@mui/icons-material/ShareRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import Link from "next/link";

const stories = [];

function UploadScreen() {
  return (
    <div>
      <div className="social-wrapper">
        <div className="active-feeds">
          <div className="feeds-title title">
            <span>Stories</span>
          </div>
          <div className="feeds-container">
            <ul className="feeds-list">
              {[...(new Array(5).keys() as unknown as number[])].map(
                (index) => {
                  return (
                    <li className="feeds" key={index}>
                      <div className="front-feed">
                        <img
                          src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
                          className="feed-image"
                          alt=""
                        />
                      </div>
                      <div className="status-title">
                        <span className="owner-name">Abigail</span>
                      </div>
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        </div>
        <div className="upload create-post">
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
          <ul className="post-of-users general">
            <li className="post each">
              <div className="post-wrapper">
                <div className="post-content">
                  <div className="uploader-wrap">
                    <div className="user-image">
                      <img
                        src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
                        alt=""
                        className="image"
                      />
                    </div>
                    <div className="name">
                      <div className="username text">
                        Oderinde james Oluwatimileyin
                      </div>
                    </div>
                  </div>
                  <div className="image-post">
                    <div className="swiper-container">
                      <div className="swiper-wrapper">
                        <div className="swiper-slide">
                          <div className="image-content">
                            <img
                              src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
                              alt=""
                              className="image"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="post-response feedback">
                  <Button
                    className="likes-count replys"
                    color="inherit"
                    id="thumb"
                  >
                    <ThumbIcon fontSize="small" />
                    <span className="count">500</span>
                  </Button>
                  <Button
                    className="comments-counts replys"
                    color="inherit"
                    id="comment"
                  >
                    <CommentIcon fontSize="small" />
                    <span className="count">500</span>
                  </Button>
                  <Button
                    className="shares-counts replys"
                    color="inherit"
                    id="share"
                  >
                    <ShareIcon fontSize="small" />
                    <span className="count">500</span>
                  </Button>
                </div>
                <div className="post-attributes">
                  <div className="tags-container">
                    <span className="tag-label">#tags - </span>
                    <Stack spacing={1} direction="row">
                      <Link href="#" passHref>
                        <a className="tags">@James</a>
                      </Link>
                      <Link href="#" passHref>
                        <a className="tags">@tj-dibbs</a>
                      </Link>
                      <Link href="#" passHref>
                        <a className="tags">@ayomide-king</a>
                      </Link>
                    </Stack>
                  </div>
                  <div className="caption-container">
                    <span className="caption-label">#caption - </span>
                    <span className="caption-text">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quo, mollitia tempora delectus repudiandae eum iste!
                    </span>
                  </div>
                </div>
                <div className="fast-comment-box">
                  <div className="recent-comment">
                    <div className="user">
                      <div className="user-image">
                        <img
                          src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
                          alt=""
                          className="image"
                        />
                      </div>
                      <div className="user-name name">
                        <div className="username">Davido Adeniyi</div>
                      </div>
                    </div>
                    <div className="user-comment">
                      <div className="text">
                        What is wrong with you &#128513; &#128513;
                      </div>
                    </div>
                  </div>
                  <div className="comment-create-box input-box">
                    <div className="input-group">
                      <IconButton size="small" className="icon media-icon">
                        <LinkRoundedIcon fontSize="small" />
                      </IconButton>
                      <textarea
                        placeholder="Type a message.."
                        name="message"
                        id="text-control"
                        className="text-control"
                      ></textarea>
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
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UploadScreen;
