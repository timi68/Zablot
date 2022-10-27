import React from "react";
import { Button, IconButton } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { Divider } from "antd";
import { Question } from "@lib/interfaces";
import Clear from "@mui/icons-material/ClearAll";

type Props = {
  questions: Question[];
  page: number;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
};

function AttemptQuestion({ questions, page, setQuestions }: Props) {
  const { question, options, key } = questions[page];
  let answered = options.some((opt) => opt.checked);

  const ClearAnswer = () => {
    let updatedQuestions = questions.map((ques) => {
      if (ques.key === key) {
        return {
          ...ques,
          options: ques.options.map((opt) => {
            return { ...opt, checked: false };
          }),
        };
      }

      return ques;
    });

    setQuestions(updatedQuestions);
  };

  return (
    <motion.div
      initial={{ scale: 0.6, y: 100 }}
      animate={{ scale: 1, y: 0 }}
      key={key}
    >
      <div className="flex justify-between min-h-[50px] items-center page bg-white p-2 mb-2 rounded-lg font-semibold">
        <span>Question {page + 1}</span>
        <AnimatePresence>
          {answered && (
            <motion.div
              animate={{ scale: 1, x: 0 }}
              initial={{ scale: 0, x: 100 }}
              exit={{ scale: 0 }}
              transition={{
                delay: 0.1,
              }}
            >
              <IconButton
                size="small"
                onClick={ClearAnswer}
                className="bg-yellow-100 shadow-sm shadow-yellow-100"
              >
                <Clear />
              </IconButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="question text">{question}</div>
      <Divider />
      <ul className="options-wrap grid gap-2">
        {options.map((option) => {
          return (
            <motion.li
              whileHover={{ scale: 1.03, x: 10 }}
              whileTap={{ scale: 0.9 }}
              className="form-group list-none"
              key={option.key}
            >
              <Button
                color="inherit"
                onClick={() => {
                  let updatedQuestions = questions.map((ques) => {
                    if (ques.key === key) {
                      return {
                        ...ques,
                        options: ques.options.map((opt) => {
                          return { ...opt, checked: opt.key === option.key };
                        }),
                      };
                    }

                    return ques;
                  });

                  setQuestions(updatedQuestions);
                }}
                className={
                  "option font-normal text-xs capitalize p-3 rounded-lg w-full justify-start" +
                  (option.checked
                    ? " bg-[#865711] text-white active"
                    : " bg-lightgrey sm:hover:bg-[#cecece]")
                }
              >
                {option.text}
              </Button>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}

export default AttemptQuestion;
