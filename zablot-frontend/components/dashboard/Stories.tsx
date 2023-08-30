import React from "react";
import { Avatar } from "@mui/material";
import stringToColor from "@utils/stringToColor";
import { useAppSelector } from "@lib/redux/store";

function Stories() {
  const user = useAppSelector((state) => state.sessionStore.user);

  return (
    <div className="feeds-container relative">
      <div className="start w-8  bg-gradient-to-r from-[#f5f5f5] absolute left-0 top-0 z-10 h-full" />
      <ul className="feeds-list flex px-2 gap-x-2 w-full overflow-auto ">
        {user && (
          <li className="feed grid place-items-center">
            <div className="border rounded-full border-dashed border-slate-900 p-1">
              <Avatar
                src={user.image.profile}
                className="h-[50px] w-[50px]"
                alt={user.firstName}
                sx={{
                  bgcolor: stringToColor(user.firstName),
                }}
              >
                {user.firstName.split(" ")[0][0] +
                  (user.firstName.split(" ")[1]?.at(0) ?? "")}
              </Avatar>
            </div>

            <div className="status-label">
              <span className="!font-['Nunito'] text-xs text-center font-bold">
                You
              </span>
            </div>
          </li>
        )}
        {[
          "Tolu",
          "Adeben",
          "Sandra",
          "Abigail",
          "Fife",
          "Jeje",
          "Jagun",
          "Razaq",
          "Grace",
          "Ayomi",
          "CEO",
          "Sanni",
        ].map((item) => {
          return (
            <li className="feed grid place-items-center" key={item}>
              <div className="border rounded-full border-dashed border-slate-900 p-[3px]">
                <Avatar
                  src={"./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"}
                  className="h-[50px] w-[50px]"
                  alt={user.firstName}
                  sx={{
                    bgcolor: stringToColor(user.firstName),
                  }}
                >
                  {user.firstName.split(" ")[0][0] +
                    (user.firstName.split(" ")[1]?.at(0) ?? "")}
                </Avatar>
              </div>
              <div className="status-label">
                <span className="!font-['Nunito'] text-xs text-center">
                  {item}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="start w-8 bg-gradient-to-l from-[#f5f5f5] absolute right-0 top-0 h-full z-10" />
    </div>
  );
}

export default Stories;
