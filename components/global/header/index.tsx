import React from "react";
import { AppBar, Typography } from "@mui/material";
import TopNavigation from "@comp/TopNavigation";
import { useAppSelector } from "@lib/redux/store";

function Header() {
  const device = useAppSelector((state) => state.sessionStore.device);
  return (
    device != "mobile" && (
      <AppBar position="sticky" className="header">
        <div className="toolbar">
          <Typography
            component="h2"
            variant="h5"
            color="primary"
            className="logo title display-large"
            sx={{
              fontWeight: 700,
              fontFamily: "Poppins !important",
            }}
          >
            Zablot
          </Typography>
          <TopNavigation />
        </div>
      </AppBar>
    )
  );
}

export default Header;
