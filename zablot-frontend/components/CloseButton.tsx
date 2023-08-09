import React from "react";
import { motion } from "framer-motion";

function CloseButton(props: { close: () => void }) {
  return (
    <motion.button
      className="close-modal hover:bg-green/20"
      onClick={props.close}
      whileTap={{ scale: 0.9 }}
      whileHover={{
        scale: 1.1,
      }}
    >
      <span>Close</span>
    </motion.button>
  );
}

export default CloseButton;
