import { nanoid } from "@reduxjs/toolkit";
import { Question } from "./interfaces";

export const Questions: Question[] = [
  {
    key: nanoid(),
    question: "What is the name of the boy and the person behind her.",
    options: [
      { key: nanoid(), text: "Tolulope, and gift.", checked: false },
      { key: nanoid(), text: "I really don't know", checked: false },
      { key: nanoid(), text: "Maybe james, and sandra", checked: false },
      { key: nanoid(), text: "None of the option", checked: false },
    ],
  },
  {
    key: nanoid(),
    question:
      "The main building of the road was constructed with concrete & ___ ?",
    options: [
      { key: nanoid(), text: "Bricks", checked: false },
      { key: nanoid(), text: "Blocks", checked: false },
      { key: nanoid(), text: "Stones", checked: false },
      { key: nanoid(), text: "Mud", checked: false },
    ],
  },
  {
    key: nanoid(),
    question: "What is the name of the boy and the person behind her.",
    options: [
      { key: nanoid(), text: "Tolulope, and gift.", checked: false },
      { key: nanoid(), text: "I really don't know", checked: false },
      { key: nanoid(), text: "Maybe james, and sandra", checked: false },
      { key: nanoid(), text: "None of the option", checked: false },
    ],
  },
  {
    key: nanoid(),
    question:
      "The main building of the road was constructed with concrete & ___ ?",
    options: [
      { key: nanoid(), text: "Bricks", checked: false },
      { key: nanoid(), text: "Blocks", checked: false },
      { key: nanoid(), text: "Stones", checked: false },
      { key: nanoid(), text: "Mud", checked: false },
    ],
  },
  {
    key: nanoid(),
    question: "What is the name of the boy and the person behind her.",
    options: [
      { key: nanoid(), text: "Tolulope, and gift.", checked: false },
      { key: nanoid(), text: "I really don't know", checked: false },
      { key: nanoid(), text: "Maybe james, and sandra", checked: false },
      { key: nanoid(), text: "None of the option", checked: false },
    ],
  },
  {
    key: nanoid(),
    question:
      "The main building of the road was constructed with concrete & ___ ?",
    options: [
      { key: nanoid(), text: "Bricks", checked: false },
      { key: nanoid(), text: "Blocks", checked: false },
      { key: nanoid(), text: "Stones", checked: false },
      { key: nanoid(), text: "Mud", checked: false },
    ],
  },
];
