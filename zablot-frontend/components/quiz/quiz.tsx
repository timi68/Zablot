import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Quiz } from "@lib/interfaces";
import { useRouter } from "next/router";

function Quiz({ quiz }: { quiz: Quiz }) {
  const router = useRouter();
  let id = quiz._id.substring(12);

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02, translateZ: 500 }}
      className="quiz card shadow-lg rounded-lg overflow-hidden cursor-pointer"
      layoutId={`wrap-${id}`}
      onClick={() =>
        router.push(
          "/quiz/attempt/?view=" + quiz._id,
          "/quiz/attempt/" + quiz._id,
          {
            shallow: true,
          }
        )
      }
    >
      <motion.div
        layoutId={`cover-img-${id}`}
        className="cover-img w-full h-[200px] relative"
      >
        <image
          src={"/images/cover1.jpg"}
          alt="This is quiz cover image"
          layout="fill"
        />
      </motion.div>
      <motion.div
        className={`card-content p-2`}
        layoutId={`card-content-${id}`}
      >
        <div className="title font-extrabold whitespace-nowrap font-[nunito,calibri] overflow-hidden text-ellipsis">
          {quiz.title}
        </div>
        <div className="flex justify-between py-2 items-center">
          <span className="duration text-xs">1hr 30mins</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Quiz;
