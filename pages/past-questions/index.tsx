import React from "react";
import { useSnackbar } from "notistack";
import * as Interfaces from "@lib/interfaces";
import FetchUser from "@lib/fetch_user";
import axios from "axios";
import { NextRouter, useRouter } from "next/router";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { Olevel, Universities, Polytechniques } from "@utils/questions";
import { CardActionArea } from "@mui/material";
import { useAppSelector, useAppDispatch } from "@lib/redux/store";
import getUser from "@lib/getUser";

const tabLabels = ["Olevel", "Universities", "Polytechniques"];

function getLabel(route: string): number {
  var label: number;
  tabLabels.forEach((name, index) => {
    console.log({ name, index });
    if (name === route) label = index;
  });

  return label;
}

export default function PastQuestions(props: { user: string }) {
  const { loggedIn, user, socket } = useAppSelector(
    (state) => state.sessionStore
  );
  const dispatch = useAppDispatch();
  const router: NextRouter = useRouter();
  const [tab, setTab] = React.useState<number>(0);
  const { enqueueSnackbar } = useSnackbar();

  React.useLayoutEffect(() => {
    const route = router.asPath.split("#")[1];
    if (route) {
      var tabIndex: number = getLabel(route);
      setTab(tabIndex);
    }
  }, [router.asPath]);

  React.useEffect(() => {
    !user && FetchUser(dispatch, enqueueSnackbar, props.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="content-main">
      <div className="past-questions-wrapper">
        <div className="page-title">
          <div className="primary-text">Past Questions</div>
          <div className="secondary-text">
            Explore from our collections of possible questions in your upcoming
            exams
          </div>
        </div>
        <AnimateSharedLayout>
          <motion.div layout className="exams-wrapper">
            <motion.div layout className="nav-wrapper">
              <div className="btn-group">
                {tabLabels.map((name, index) => {
                  return (
                    <motion.a
                      layout
                      href={"#" + name}
                      key={index}
                      className={
                        "btn-toggle" + (tab === index ? " active" : "")
                      }
                      onClick={() => setTab(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transitionDuration: "1s",
                        transitionDelay: 0.1 * index + "s",
                      }}
                    >
                      <span className="text">{name}</span>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
            <motion.div layout className="card-wrappers exam-list">
              {tab === 0 &&
                Olevel.map((exam, index) => {
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        opacity: 1,
                        transitionDuration: "1s",
                        transitionDelay: 0.1 * index + "s",
                        scale: 1,
                      }}
                      key={index}
                      onClick={() =>
                        router.push(
                          `/past-questions/Olevel/${exam.name.toLocaleLowerCase()}`
                        )
                      }
                    >
                      <CardActionArea className="exam card">
                        <div className="exam-title">
                          {exam.name.toLocaleUpperCase()}
                        </div>
                        <div className="content">
                          <div className="quesions">
                            {exam.questions}+ questions
                          </div>
                          <div className="subjects">
                            {exam.subjects}+ subjects
                          </div>
                        </div>
                      </CardActionArea>
                    </motion.div>
                  );
                })}
              {tab === 1 &&
                Universities.map((school, index) => {
                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        opacity: 1,
                        transitionDuration: "1s",
                        transitionDelay: 0.1 * index + "s",
                        scale: 1,
                      }}
                      key={index}
                      onClick={() =>
                        router.push(
                          `/past-questions/universities/${school.name.toLocaleLowerCase()}`
                        )
                      }
                    >
                      <CardActionArea className="exam card">
                        <div className="exam-title">
                          {school.name.toLocaleUpperCase()}
                        </div>
                        <div className="content">
                          <div className="subjects">
                            {school.course}+ courses
                          </div>
                        </div>
                      </CardActionArea>
                    </motion.div>
                  );
                })}
              {tab === 2 &&
                Polytechniques.map((school, index) => {
                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        opacity: 1,
                        transitionDuration: "1s",
                        transitionDelay: 0.1 * index + "s",
                        scale: 1,
                      }}
                      key={index}
                      onClick={() =>
                        router.push(
                          `/past-questions/polytechniques/${school.name.toLocaleLowerCase()}`
                        )
                      }
                    >
                      <CardActionArea className="exam card">
                        <div className="exam-title">
                          {school.name.toLocaleUpperCase()}
                        </div>
                        <div className="content">
                          <div className="subjects">
                            {school.course}+ courses
                          </div>
                        </div>
                      </CardActionArea>
                    </motion.div>
                  );
                })}
            </motion.div>
          </motion.div>
        </AnimateSharedLayout>
      </div>
      <div className="education-news-update">
        <div className="latest-news education">
          <div className="header">
            <div className="title">Update on Education news</div>
          </div>
          <div className="news-body">
            {[...(Array(5).keys() as unknown as number[])].map((key) => {
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transitionDuration: "1s",
                    transitionDelay: 0.1 * key + "s",
                  }}
                >
                  <CardActionArea className="news-group">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Commodi numquam quasi molestias nihil tempora quas error
                    quia veniam perferendis non inventore illum, eum atque
                    ratione similique sequi? Debitis, neque alias.
                  </CardActionArea>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  try {
    const user_id = req.session.user;

    if (!user_id) throw new Error("There is no session");

    const user = getUser(user_id);
    if (!user) throw new Error("User not found");

    return {
      props: { user: JSON.stringify(user) },
    };
  } catch (error) {
    console.log({ error });
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
}
