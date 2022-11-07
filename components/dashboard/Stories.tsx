import React from "react";
import { Avatar } from "@mui/material";
import stringToColor from "@utils/stringToColor";
import { useAppSelector } from "@lib/redux/store";

function Stories() {
  const user = useAppSelector((state) => state.sessionStore.user);

  return (
    <div className="feeds-container">
      <ul className="feeds-list flex px-2 gap-x-2 w-full overflow-auto ">
        {user && (
          <li className="feed grid place-items-center">
            <div className="border rounded-full border-dashed border-slate-900 p-1">
              <Avatar
                src={user.Image.profile}
                className="h-[50px] w-[50px]"
                alt={user.FullName}
                sx={{
                  bgcolor: stringToColor(user.FullName),
                }}
              >
                {user.FullName.split(" ")[0][0] +
                  (user.FullName.split(" ")[1]?.at(0) ?? "")}
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
                  alt={user.FullName}
                  sx={{
                    bgcolor: stringToColor(user.FullName),
                  }}
                >
                  {user.FullName.split(" ")[0][0] +
                    (user.FullName.split(" ")[1]?.at(0) ?? "")}
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
    </div>
  );
}

export default Stories;
