/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSnackbar } from "notistack";
import FetchUser from "@lib/fetch_user";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import UploadScreen from "@comp/dashboard/uploadsection";
import dynamic from "next/dynamic";
import { USER } from "@lib/redux/userSlice";
import { useStore } from "react-redux";

const Dashboard = (props: {
  children?: React.ReactNode;
  user: Zablot.User;
}) => {
  const { user, socket } = useAppSelector((state) => state.sessionStore);
  const dispatch = useAppDispatch();
  const store = useStore();

  store.dispatch(USER(props.user));

  // React.useEffect(() => {
  //   !user && dispatch(USER(props.user));
  // }, [props]);

  React.useEffect(() => {
    return () => {
      socket?.off();
    };
  }, [socket]);

  return (
    <React.Fragment>
      <section className="main-body wide center-content md:flex ">
        <div className="posts social-feeds view-screen flex-1 md:grid place-items-center">
          <UploadScreen />
        </div>
        <div className="information bg-lowgrey h-[calc(100vh-75px)] overflow-auto w-[300px] mt-1 relative hidden md:block">
          {/* <div className="title">Fast Information</div> */}
          <div className="information-group-list px-4">
            {["School", "Past Questions", "Quiz"].map((label, i) => {
              return (
                <div className="info mb-5" key={label}>
                  <div className="title sticky top-0 font-bold bg-lowgrey py-3 ">
                    {label} Quick Info
                  </div>
                  <div className="infos flex flex-col gap-y-2">
                    {Array.from(new Array(4)).map((_, i) => (
                      <div
                        className="bg-white w-full h-12 rounded-lg shadow-sm"
                        key={i}
                      ></div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default dynamic(async () => Dashboard, { ssr: false });
