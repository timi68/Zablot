import React from "react";
import PollIcon from "@mui/icons-material/PollRounded";
import ImageIcon from "@mui/icons-material/ImageRounded";
import StyleIcon from "@mui/icons-material/StyleRounded";
import SendIcon from "@mui/icons-material/SendRounded";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { Modal, Input, Button } from "antd";
import Cancel from "@mui/icons-material/CancelOutlined";

interface PostInterface {
  caption: string;
  medias: File[];
}

function CreatePost() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [post, setPost] = React.useState<PostInterface>({
    medias: [],
    caption: "",
  });

  const closeModal = () => setOpen(false);
  const openModal = () => setOpen(true);

  const mediaRef = React.useRef<HTMLInputElement>(null);

  const addFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!open) setOpen(true);
    const files = e.target.files as FileList;

    setPost({ ...post, medias: Array.from(files) });
  };

  const removeMedia = (index: number) => {
    setPost({ ...post, medias: post.medias.filter((m, i) => index !== i) });
  };

  return (
    <div className="upload create-post pt-0 mb-5">
      <div className="form-group">
        <div className="text-box flex border border-solid border-gray-300 rounded-lg shadow-sm overflow-hidden">
          <input
            name="writeups"
            id="writeups"
            onClick={openModal}
            placeholder="Write something..."
            className="text-control post-text p-3 py-4 flex-grow"
          />
          <div className="alternate-post flex items-center gap-x-2 p-2">
            <Stack spacing={0.5} direction="row">
              <IconButton size="small">
                <ImageIcon
                  fontSize="small"
                  onClick={() => mediaRef.current?.click()}
                />
                <input
                  type="file"
                  name="file"
                  accept="image/jpeg,image/jpg,image/gif,image/png,video/mp4,video/mov,video/mkv"
                  multiple
                  hidden
                  onChange={addFile}
                  ref={mediaRef}
                />
              </IconButton>
              <IconButton size="small">
                <PollIcon fontSize="small" />
              </IconButton>
            </Stack>
          </div>
          {/* <div className="post-btn">
            <IconButton size="medium" className="icon">
              <SendIcon />
            </IconButton>
          </div> */}
        </div>
      </div>

      <Modal
        title="Create Post"
        style={{ top: "20px" }}
        open={open}
        onCancel={closeModal}
        onOk={closeModal}
        footer={
          <>
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-x-1">
                <IconButton onClick={() => mediaRef.current?.click()}>
                  <ImageIcon />
                </IconButton>
                <IconButton>
                  <PollIcon />
                </IconButton>
              </div>

              <Button type="primary" disabled>
                Post
              </Button>
            </div>
          </>
        }
      >
        <Input.TextArea
          bordered={false}
          rows={5}
          autoSize
          autoFocus
          className="my-4"
          placeholder="Write a caption..."
        />
        <div className="media-container flex flex-wrap gap-2 bg-gray-100 p-4 shadow-lg border border-gray-300 border-solid rounded-lg">
          {post.medias.map((media, index) => {
            return (
              <div className="media relative">
                <img
                  className="w-40 border border-solid shadow-lg border-gray-500 rounded-xl flex-grow border-collapse"
                  src={URL.createObjectURL(media)}
                />
                <Button
                  onClick={() => removeMedia(index)}
                  icon={<Cancel fontSize="small" />}
                  size="small"
                  className="absolute top-2 right-1 bg-black/70 text-white grid place-items-center"
                />
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}

export default CreatePost;
