/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Socket } from "socket.io-client";
import { MessageType } from "../../../lib/interfaces";
import Image from "next/image";
import GroupMessage from "../../../lib/Group_Message";
import Skeleton from "@mui/material/Skeleton";
import { format } from "date-fns";

type PropsType = {
  message: MessageType;
  nextComingId: boolean;
  cur: Date;
  pre: Date | null;
  i: number;
};

function IncomingImage(props: PropsType) {
  const { message, cur, pre, i, nextComingId } = props;
  // const [uploading, setUploading] = React.useState<number>(0);
  const [url, setUrl] = React.useState(null);

  React.useEffect(() => {
    if (!message.blobUrl) {
      if (
        !(window.File && window.FileReader && window.FileList && window.Blob)
      ) {
        alert("The File APIs are not fully supported in this browser.");
        return;
      }

      (async () => {
        const uploadImage = await axios.get<Blob>(message.url, {
          responseType: "blob",
        });
        setUrl(URL.createObjectURL(uploadImage.data));
      })();
    }
  }, []);

  const className = `incoming-message incoming-media${
    nextComingId || i === 0 ? " adjust-mg" : ""
  } `;

  const Group = GroupMessage({ cur, pre });

  return (
    <React.Fragment>
      {Group && (
        <div className="group">
          <span>{Group}</span>
        </div>
      )}
      <div className={className}>
        <div className="media-wrappkser">
          {url && (
            <div className="media image-file">
              <img src={url} alt={message.filename} className="image" />
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
          <span className="time">
            <small>{format(cur, "HH:mm")}</small>
          </span>
        </div>
      </div>
    </React.Fragment>
  );
}

export default IncomingImage;
