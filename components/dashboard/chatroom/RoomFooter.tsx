import React from "react";
import SendIcon from "@mui/icons-material/Send";
import AttachmentOutlinedIcon from "@mui/icons-material/AttachmentOutlined";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PollOutlinedIcon from "@mui/icons-material/PollOutlined";
import { IconButton } from "@mui/material";
import Poll from "@comp/dashboard/chatroom/Poll";
import * as Interfaces from "@lib/interfaces";
import { emitCustomEvent } from "react-custom-events";
import { updateRoom } from "@lib/redux/roomSlice";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import { getRoom } from "@lib/redux/roomSlice";
import store from "@lib/redux/store";

const RoomFooter = ({ room_id }: { room_id: string | number }) => {
  const friend = useAppSelector((state) => getRoom(state, room_id).user);
  const { user, socket } = useAppSelector((state) => state.sessionStore);
  const MessageBoxRef = React.useRef<HTMLTextAreaElement>(null);
  const RoomBodyRef = React.useRef<Interfaces.RoomBodyRefType>(null);
  const MediaRef = React.useRef<HTMLDivElement>(null);
  const PollRef = React.useRef<{
    toggle(hide?: boolean): void;
    getPollData(): {
      pollData: Interfaces.RoomType["pollData"];
      pollToggled: boolean;
    };
  }>(null);
  const ImageFileRef = React.useRef<HTMLInputElement>(null);
  const VideoFileRef = React.useRef<HTMLButtonElement>(null);
  const SendRef = React.useRef<HTMLButtonElement>(null);

  const dispatch = useAppDispatch();

  console.log("Footer Rendering", room_id);
  const handleChangeEvent = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    e.preventDefault();

    if (e.target.value) SendRef.current.classList.add("active");
    else SendRef.current.classList.remove("active");

    return;
  };

  const sendMessage = (): void => {
    let messageText: string = MessageBoxRef.current.value;

    if (!messageText) return;
    (MessageBoxRef.current.value = ""),
      SendRef.current.classList.remove("active");

    var newMessage: Interfaces.MessageType = {
      message: messageText,
      date: new Date(),
      coming: user._id,
      going: friend.Id,
      Format: "plain",
      _id: friend._id,
    };

    socket.emit(
      "OUTGOINGMESSAGE",
      newMessage,
      (err: string, { messageId }: { messageId: string }) => {
        if (!err) {
          newMessage._id = messageId;
          const messages = store.getState().rooms.entities[room_id].messages;
          dispatch(
            updateRoom({
              id: room_id,
              changes: {
                messages: [...messages, newMessage],
                type: "out",
              },
            })
          );
          emitCustomEvent("Message", {
            id: friend.Id,
            message: messageText,
            flow: user._id,
          });
        }
      }
    );
  };
  /**
   * This function controls the media toggler
   *
   */
  const handleToggle: (type: "poll" | "video" | "image") => void = (type) => {
    MediaRef.current.classList.remove("active");
    switch (type) {
      case "poll":
        PollRef.current.toggle();
        break;
      case "image":
        ImageFileRef.current.click();
      default:
        break;
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
      alert("The File APIs are not fully supported in this browser.");
      return false;
    }

    const file = e.target.files[0];
    const imageFileType: string[] = [
      "image/jpeg",
      "image/jpg",
      "image/svg",
      "image/png",
      "image/jfif",
    ];
    const videoFileType: string[] = [
      "video/mp4",
      "video/avi",
      "video/mv4",
      "video/ogm",
      "video/mpg",
    ];

    if (imageFileType.includes(file?.type)) {
      // read the files
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = function (event) {
        // blob stuff
        var blob = new Blob([event.target.result]); // create blob...
        window.URL = window.URL || window.webkitURL;
        var blobURL = window.URL.createObjectURL(blob); // and get it's URL

        let newMessage: Interfaces.MessageType = {
          message: "Image",
          Format: "image",
          date: new Date(),
          coming: user._id,
          going: friend.Id,
          _id: friend._id,
          blobUrl: blobURL,
          filename: file.name,
          file,
          upload: true,
        };

        RoomBodyRef.current.setMessages(newMessage, "out");

        const messages = store.getState().rooms.entities[room_id].messages;
        dispatch(
          updateRoom({
            id: room_id,
            changes: {
              messages: [...messages, newMessage],
              type: "out",
            },
          })
        );
        emitCustomEvent("Message", {
          id: friend.Id,
          message: "Image",
          flow: user._id,
        });
      };
    }
  };
  return (
    <div className="room-footer">
      <div className="message-create-box input-box">
        <div className="input-group message-box">
          <div className="icon media-icon">
            <IconButton
              size="small"
              onClick={() => MediaRef.current.classList.add("active")}
            >
              <AttachmentOutlinedIcon fontSize="small" />
            </IconButton>
          </div>
          <textarea
            className="text-control"
            name="message"
            ref={MessageBoxRef}
            onChange={handleChangeEvent}
            id="text-control message"
            placeholder="Type a message.."
          ></textarea>
          <div className="send-btn">
            <IconButton
              className="btn send"
              size="small"
              ref={SendRef}
              onClick={sendMessage}
            >
              <SendIcon className="send-icon" />
            </IconButton>
          </div>
        </div>
        <div className="media-message-wrapper" ref={MediaRef}>
          <div className="multimedia-list list">
            <ul className="media-list">
              <li className="media video toggle-video">
                <IconButton
                  className=" icon image-icon"
                  onClick={() => handleToggle("image")}
                >
                  <ImageOutlinedIcon fontSize="small" />
                </IconButton>
                <label className="icon-label">Image</label>
                <input
                  className="file-control image-file"
                  type="file"
                  name="image-file"
                  id="image-file"
                  ref={ImageFileRef}
                  accept="image/*"
                  onChange={handleFile}
                  hidden
                />
              </li>
              <li className="media image toggle-image">
                <IconButton className="icon video-icon">
                  <VideoLibraryIcon fontSize="small" />
                </IconButton>
                <label className="icon-label">Video</label>
                <input
                  className="file-control video-file"
                  type="file"
                  accept="video/*"
                  id="40abf369-1e9video"
                  name="video-file"
                  hidden
                />
              </li>
              <li className="media poll toggle-poll">
                <IconButton
                  className="icon"
                  id="poll-icon"
                  onClick={() => handleToggle("poll")}
                >
                  <PollOutlinedIcon fontSize="small" />
                </IconButton>
                <label className="icon-label">Poll</label>
              </li>
            </ul>
          </div>
        </div>
        {/* <Poll
          ref={PollRef}
          roomBody={RoomBodyRef}
          going={friend.Id}
          _id={friend.Id}
          coming={user._id}
          data={room.pollData}
          toggled={room.pollToggled}
        /> */}
      </div>
    </div>
  );
};

export default RoomFooter;
