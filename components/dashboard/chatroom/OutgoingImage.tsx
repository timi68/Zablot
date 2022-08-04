/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Socket } from "socket.io-client";
import { MessageType } from "../../../lib/interfaces";
import Skeleton from "@mui/material/Skeleton";
import GroupMessage from "./Group_Message";

type PropsType = {
  socket: Socket | null;
  message: MessageType;
  nextGoingId: boolean;
  hrs: number | string;
  mins: number | string;
  cur: Date;
  pre: Date | null;
  i: number;
  messagesId: string;
  coming: string;
  going: string;
  setMessageData: React.Dispatch<
    React.SetStateAction<{
      messages: MessageType[];
      type: "in" | "out" | "loaded";
    }>
  >;
};

function OutgoingImage(props: PropsType): JSX.Element {
  const {
    hrs,
    mins,
    cur,
    pre,
    i,
    socket,
    message,
    nextGoingId,
    setMessageData,
  } = props;
  const loaderRef = React.useRef<{ setValue(value: number): void }>(null);

  // const Progress = (ProgressEvent: any) => {
  // 	let percentageLoaded = Math.floor(
  // 		(ProgressEvent.loaded / ProgressEvent.total) * 100
  // 	);

  // 	console.log({percentageLoaded});
  // 	// let step = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  // 	// setTimeout(() => {
  // 	// 	(() => {
  // 	// 		loaderRef.current.setValue(percentageLoaded);
  // 	// 	})();
  // 	// }, 500);
  // };

  React.useEffect(() => {
    if (message.upload) {
      (async () => {
        const form = new FormData();
        form.append("image", message.file);

        try {
          // let config = {
          // 	onUploadProgress: Progress,
          // };
          const uploadImage = await axios.post("/api/media/upload", form);

          let data = {
            ...message,
            url: uploadImage.data[0].url,
            filename: uploadImage.data[0].filename,
          };

          delete message.upload, delete message.file;

          setMessageData((prevState) => {
            const messages: MessageType[] = prevState.messages.map((m) => {
              if (m._id === message._id) {
                return data;
              }
              return m;
            });

            return { messages, type: null };
          });

          console.log({ message }, "After");

          socket.emit("OUTGOINGMESSAGE", data, (res: { messageId: string }) => {
            console.log({ res });
          });
        } catch (err) {
          console.log(err);
          return;
        }

        // if (uploadImage.respons.success) {
        // 	socket.emit()
        // }
      })();
    }

    if (!message.blobUrl) {
      if (
        !(window.File && window.FileReader && window.FileList && window.Blob)
      ) {
        alert("The File APIs are not fully supported in this browser.");
        return;
      }
      console.log("Getting image reading");
      (async () => {
        const uploadImage = await axios.get<Blob>(message.url, {
          responseType: "blob",
        });
        console.log({ data: uploadImage.data });
        setMessageData((prevState) => {
          const messages: MessageType[] = prevState.messages.map((m) => {
            if (m._id === message._id) {
              m.blobUrl = URL.createObjectURL(uploadImage.data);
            }
            return m;
          });
          return { messages, type: null };
        });
      })();
    }
  }, []);

  const className = `outgoing-message outgoing-media${
    nextGoingId || i === 0 ? " adjust-mg" : ""
  } `;

  const time = hrs + ":" + mins;
  const Group = GroupMessage({ cur, pre, i });

  return (
    <React.Fragment>
      {Group && (
        <div className="group">
          <span>{Group}</span>
        </div>
      )}
      <div className={className}>
        <div className="media-wrapper">
          {Boolean(message.blobUrl) && (
            <div className="media image-file">
              <img
                src={message.blobUrl}
                alt={message.filename}
                className="image"
              />
            </div>
          )}
          {!Boolean(message.blobUrl) && (
            <Skeleton
              variant="rectangular"
              animation="wave"
              width={100}
              height={150}
            />
          )}
          {message.upload && <Loader ref={loaderRef} />}

          <span className="time">
            <small>{time}</small>
          </span>
        </div>
      </div>
    </React.Fragment>
  );
}

const Loader = React.forwardRef((props, ref) => {
  const [value, setValue] = React.useState<number>(0);

  React.useImperativeHandle(
    ref,
    () => ({
      setValue(value: number) {
        setValue(value);
      },
    }),
    []
  );

  React.useEffect(() => {
    var timeout: NodeJS.Timeout;

    timeout = setTimeout(() => {
      setValue(value + 10);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [value]);

  if (value < 100) {
    return (
      <div className="media-loader">
        <CircularProgress
          variant="determinate"
          value={value}
          size={30}
          sx={{ borderColor: "#fff" }}
          thickness={3}
        />
      </div>
    );
  }

  return null;
});
Loader.displayName = "Loader";

export default OutgoingImage;
