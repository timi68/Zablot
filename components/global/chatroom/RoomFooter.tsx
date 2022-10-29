import React from "react";
import SendIcon from "@mui/icons-material/Send";
import AttachmentOutlinedIcon from "@mui/icons-material/AttachmentOutlined";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PollOutlinedIcon from "@mui/icons-material/PollOutlined";
import CloseIcon from "@mui/icons-material/CloseRounded";
import {
  Box,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import Poll from "@comp/global/chatroom/Poll";
import * as Interfaces from "@lib/interfaces";
import { emitCustomEvent } from "react-custom-events";
import { updateRoom } from "@lib/redux/roomSlice";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import { getRoom } from "@lib/redux/roomSlice";
import store from "@lib/redux/store";
import j from "jquery";

const actions = [
  { icon: <ImageOutlinedIcon fontSize="small" />, name: "Send image" },
  { icon: <VideoLibraryIcon fontSize="small" />, name: "Send Video" },
  { icon: <PollOutlinedIcon fontSize="small" />, name: "Send Poll" },
];

type y = "send image" | "send video" | "send poll";

const RoomFooter = ({ room_id }: { room_id: string | number }) => {
  const friend = useAppSelector((state) => getRoom(state, room_id).friend);
  const { user, socket, device } = useAppSelector(
    (state) => state.sessionStore
  );
  const MessageBoxRef = React.useRef<HTMLTextAreaElement>(null);
  const MediaRef = React.useRef<HTMLDivElement>(null);
  const PollRef = React.useRef<{
    toggle(hide?: boolean): void;
  }>(null);
  const [open, setOpen] = React.useState(false);

  const ImageFileRef = React.useRef<HTMLInputElement>(null);
  const VideoFileRef = React.useRef<HTMLButtonElement>(null);
  const SendRef = React.useRef<HTMLButtonElement>(null);

  const dispatch = useAppDispatch();
  const sendMessage = (): void => {
    let messageText: string = MessageBoxRef.current.value;

    if (!messageText) return;

    j(SendRef.current).removeClass("active");
    j(MessageBoxRef.current).val("").trigger("focus").removeAttr("style");

    var newMessage: Interfaces.MessageType = {
      message: messageText,
      date: Date.now(),
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
            time: newMessage.date,
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
  const handleToggle: (type: y) => void = (type) => {
    setOpen(false);
    switch (type) {
      case "send poll":
        PollRef.current.toggle();
        break;
      case "send image":
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
          date: Date.now(),
          coming: user._id,
          going: friend.Id,
          _id: friend._id,
          blobUrl: blobURL,
          filename: file.name,
          file,
          upload: true,
        };

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

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      e.key == "Enter" &&
      !e.shiftKey &&
      !["mobile", "tablet"].includes(device)
    ) {
      e.preventDefault();
      SendRef.current.click();
    }
  };

  return (
    <div className="room-footer">
      <div className="message-create-box input-box flex h-full items-end">
        <SpeedDial
          open={open}
          onClick={() => setOpen(true)}
          onClose={() => setOpen(false)}
          sx={SpeedDialCss}
          color="inherit"
          ariaLabel="SpeedDial openIcon"
          icon={
            <SpeedDialIcon
              icon={<AttachmentOutlinedIcon fontSize="small" />}
              openIcon={<CloseIcon fontSize="small" sx={{ mt: "1.5px" }} />}
            />
          }
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              tooltipPlacement={"right"}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => handleToggle(action.name.toLowerCase() as y)}
            />
          ))}
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
          <input
            className="file-control video-file"
            type="file"
            accept="video/*"
            name="video-file"
            hidden
          />
        </SpeedDial>
        <div className="input-group message-box relative flex-grow">
          <textarea
            placeholder="Type a message..."
            className="text-control transition-all"
            onKeyPressCapture={handleKey}
            onChange={({ target: element }) => {
              element.style.height = "5px";
              element.style.height = element.scrollHeight + "px";

              console.log({ scroll: element.scrollHeight });

              if (element.value) SendRef.current.classList.add("active");
              else SendRef.current.classList.remove("active");
            }}
            ref={MessageBoxRef}
            id="text-control message"
          />
        </div>
        <IconButton
          className="btn send send-btn"
          size="small"
          ref={SendRef}
          onClick={sendMessage}
        >
          <SendIcon className="h-[18px] w-[18px] ml-1" color="inherit" />
        </IconButton>
        <Poll
          ref={PollRef}
          going={friend.Id}
          _id={friend._id}
          coming={user._id}
          room_id={room_id}
        />
      </div>
    </div>
  );
};

const SpeedDialCss = {
  maxHeight: 40,
  zIndex: 10,
  "& .MuiSpeedDial-fab": {
    maxWidth: 36,
    bgcolor: "transparent",
    "&:hover": {
      bgcolor: "rgb(87, 130, 137)",
      color: "#fff",
    },
  },
  "& .MuiSpeedDial-actions": {
    pb: "39px",
  },
  "& .MuiSpeedDialAction-fab": {
    width: 35,
    height: 35,
    my: 0.5,
    transition: ".30 all ease-in-out",
    "&:hover": {
      bgcolor: "rgb(87, 130, 137)",
      color: "#fff",
    },
  },
};

export default RoomFooter;
