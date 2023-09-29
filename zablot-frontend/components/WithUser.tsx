import React from "react";
import { USER } from "@lib/redux/userSlice";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";

function WithUser(props: { user: Zablot.User; children: React.ReactNode }) {
  const user = useAppSelector((state) => state.sessionStore.user);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    !user && dispatch(USER(props.user));
  }, [props]);

  if (!user) return <></>;

  return props.children;
}

export default WithUser;
