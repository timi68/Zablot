import React from "react";
import { useAppSelector } from "@lib/redux/store";
import AuthenticatedLayout from "@comp/AuthenticatedLayout";

export interface PropsInterface {
  children: React.ReactNode;
}

export default React.memo(function AppLayout(props: PropsInterface) {
  const isLoggedIn = useAppSelector((state) => state.sessionStore.loggedIn);

  return isLoggedIn ? <AuthenticatedLayout {...props} /> : props.children;
});
