import { AnimatePresence } from "framer-motion";
import React from "react";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";

interface BackdropPropsInterface {
  children: React.ReactNode;
  open: React.Dispatch<React.SetStateAction<boolean>>;
}

function Backdrop(props: BackdropPropsInterface) {
  const self = React.useRef<HTMLDivElement>(null);
  const [unMount, setUnMount] = React.useState<boolean>(false);

  const CaptureClick = (e: React.MouseEvent) => {
    e.target === self.current && setUnMount(true);
  };

  const unMountChildren = () => {
    props.open(false), emitCustomEvent("off");
  };

  useCustomEventListener("remove_overlay", () => setUnMount(true), [props]);

  return (
    <AnimatePresence onExitComplete={unMountChildren}>
      <div
        key={"backdrop"}
        className="h-screen fixed w-screen top-0 left-0 z-30"
        ref={self}
        onClickCapture={CaptureClick}
      />
      {!unMount && props.children}
    </AnimatePresence>
  );
}

export default Backdrop;
