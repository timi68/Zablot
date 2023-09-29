import React from "react";
import CreateQuestion from "@comp/quiz/createQuestion";
import { getServerSideProps } from "pages";
import WithUser from "@comp/WithUser";

export default function QuizCreator(props: { user: Zablot.User }) {
  return (
    <WithUser user={props.user}>
      <div className="create-quiz-wrapper">
        <CreateQuestion />
      </div>
    </WithUser>
  );
}

export { getServerSideProps };
