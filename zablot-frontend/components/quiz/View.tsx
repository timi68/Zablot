import { Quiz } from "@types";
import { useRouter } from "next/router";
import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import j from "jquery";
import { marked } from "marked";
import { Divider } from "@mui/material";

function View({ quizzes, view }: { quizzes: Quiz[]; view: string }) {
  const router = useRouter();
  const quizToView = quizzes.find((quiz) => quiz._id === view);
  const id = quizToView?._id.substring(12);

  return (
    <div className="view-container grid place-items-center fixed z-[9999999] w-screen h-screen overflow-auto left-0 top-0 ">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        transition={{ duration: 0.2, delay: 0.15 }}
        style={{ pointerEvents: "auto" }}
        className="cursor-pointer w-screen fixed z-[999999]  left-0 top-0 bottom-0 bg-black bg-opacity-40"
        onClick={() => router.back()}
      />
      <motion.div
        className="quiz card relative z-[99999999] shadow-lg rounded-lg overflow-hidden bg-gray-200 w-[700px] max-w-[90vw]"
        layoutId={`wrap-${id}`}
      >
        <motion.div
          layoutId={`cover-img-${id}`}
          className="cover-img w-full h-[300px] relative"
        >
          <image
            src={"/images/cover1.jpg"}
            alt="This is quiz cover image"
            className="h-full"
            layout="fill"
          />
        </motion.div>
        <motion.div
          className={`card-content p-2`}
          layoutId={`card-content-${id}`}
        >
          <div className="title text-lg font-extrabold font-[nunito,calibri] overflow-hidden text-ellipsis">
            {quizToView.title}
          </div>
          <motion.div className="description-container" animate>
            <Divider textAlign="left" className="text-xs my-2">
              <span>Description</span>
            </Divider>
            <div
              className="text p-4"
              dangerouslySetInnerHTML={{
                __html: marked.parse(quizToView.description),
              }}
            />
          </motion.div>
          <div className="flex justify-between p-2 items-center">
            <span className="duration text-xs">
              {quizToView.duration[0]}hr {quizToView.duration[0]}mins
            </span>
            <motion.button
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              onClick={() =>
                router.replace(
                  `/quiz/attempt/${quizToView._id}/start?token=nvm&access=public`
                )
              }
              className="btn bg-green text-white rounded-3xl shadow-xl min-w-max px-3 py-2 text-xs h-full"
            >
              Start Quiz
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default View;
