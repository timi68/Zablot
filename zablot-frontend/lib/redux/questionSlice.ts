import { RootState, useAppDispatch } from "./store";
import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import cookie from "js-cookie";
import { Question } from "@types";
import store from "@lib/redux/store";

const questionsAdapter = createEntityAdapter<Question>({
  selectId: (question) => question.key,
});

export const localQuestions = () =>
  JSON.parse(localStorage.getItem("questions") ?? "[]") as Question[];
const setLocal = (questions) =>
  localStorage.setItem("questions", JSON.stringify(questions));

const questionsSlice = createSlice({
  name: "appState",
  initialState: questionsAdapter.getInitialState({
    loading: "idle",
  }),
  reducers: {
    addQuestion: (state, actions: PayloadAction<Question>) => {
      questionsAdapter.addOne(state, actions);
      setLocal([...localQuestions(), actions.payload]);
    },
    updateQuestion: (
      state,
      actions: PayloadAction<{
        id: string | number;
        changes: Partial<Question>;
      }>
    ) => {
      questionsAdapter.updateOne(state, actions);

      let newLocal = localQuestions().map((ques) => {
        if (ques.key === actions.payload.id) {
          return {
            ...ques,
            ...actions.payload.changes,
          };
        }

        return ques;
      });

      setLocal(newLocal);
    },
    removeQuestion: (state, actions: PayloadAction<string | number>) => {
      questionsAdapter.removeOne(state, actions);
      let newLocal = localQuestions().filter(
        (ques) => ques.key !== actions.payload
      );

      setLocal(newLocal);
    },
    addManyQuestion: questionsAdapter.addMany,
    removeAllQuestion: (state) => {
      questionsAdapter.removeAll(state);
      setLocal([]);
    },
  },
});

export const {
  addQuestion,
  updateQuestion,
  removeQuestion,
  addManyQuestion,
  removeAllQuestion,
} = questionsSlice.actions;
export const {
  selectAll: getQuestions,
  selectIds: getQuestionIds,
  selectById: getQuestion,
} = questionsAdapter.getSelectors<RootState>((state) => state.questions);

export default questionsSlice.reducer;
