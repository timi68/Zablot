import React from "react";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { Chip } from "@mui/material";
import { useCustomEventListener } from "react-custom-events";

function Coin() {
  const [coins, setCoins] = React.useState();

  useCustomEventListener(
    "coin",
    (detail: { num: number; action: "less" | "add" }) => {
      const { num, action } = detail;
      console.log({ detail });
    }
  );

  return (
    <Chip
      label="500"
      className="coin-wrapper"
      icon={<MonetizationOnIcon fontSize="small" />}
    />
  );
}

export default Coin;
