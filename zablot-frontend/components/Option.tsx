import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { IconButton, Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import { isEqual } from "lodash";

type OptionType = { text: string; checked: boolean; key: string };

function Option(props: {
  height?: number;
  option: OptionType;
  HandleAnswerChecked(key: string): void;
  HandleOptionTextChange(
    e: React.ChangeEvent<HTMLTextAreaElement>,
    key: string
  ): void;
  RemoveOption(index: string): void;
}) {
  const variant = {
    visible: {
      scale: 1,
      boxShadow: "0px 2px 7px rgb(182,182,182)",
    },
    hidden: {
      scale: 0.3,
      boxShadow: "0px 0px 0px whitesmoke",
    },
    exit: {
      opacity: 0,
      scale: 0,
      boxShadow: "0px 0px 0px whitesmoke",
    },
  };

  return (
    <motion.li
      key={props.option.key}
      layout
      className="option relative h-[30px] flex items-center bg-white rounded-lg overflow-hidden"
      variants={variant}
      transition={{ type: "just" }}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <input
        type="radio"
        name={props.option.text}
        id="answer"
        className="answer"
        onChange={() => props.HandleAnswerChecked(props.option.key)}
        checked={props.option.checked}
      />
      <div className="text-box flex-grow h-full">
        <textarea
          name="option-input"
          placeholder="Enter option.."
          className="text-control text-sm w-full h-full p-[5px_10px] bg-transparent resize-none"
          value={props.option.text}
          onChange={(e) => {
            props.HandleOptionTextChange(e, props.option.key);
          }}
        ></textarea>
      </div>
      <IconButton
        className="cursor-pointer w-[25px] m-1"
        size="small"
        onClick={() => props.RemoveOption(props.option.key)}
      >
        <CancelIcon fontSize="small" />
      </IconButton>
    </motion.li>
  );
}

export default React.memo(Option, (old, current) => {
  return isEqual(old.option, current.option);
});
