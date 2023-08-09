import React from "react";
import { Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";

function Back(props: { onClick?: (e?: React.MouseEvent) => void }) {
  return (
    <Tooltip title="Go back to previous page" placement="bottom">
      <motion.div
        whileHover={{ scale: 0.9 }}
        className="relative bg-green h-[30px] w-[30px] rounded-3xl"
      >
        <motion.button
          {...props}
          whileHover={{ x: -10 }}
          whileTap={{ x: -20 }}
          className="bg-transparent"
        >
          <KeyboardBackspaceRoundedIcon
            fontSize="large"
            className="ml-[5px] mt-[-2px] text-white"
          />
        </motion.button>
      </motion.div>
    </Tooltip>
  );
}

export default Back;
