/* eslint-disable react/no-unescaped-entities */
import { useRouter } from "next/router";
import { Button } from "@mui/material";

export default function Error_404() {
  const router = useRouter();

  return (
    <div
      className="error_wrapper"
      style={{
        display: "grid",
        flexGrow: 1,
        fontWeight: 500,
        textAlign: "center",
        placeItems: "center",
        placeContent: "center",
      }}
    >
      <div className="error-message">
        404 | - The Page your looking for doesn't exist
      </div>
      <Button
        color="primary"
        variant="contained"
        onClick={() => router.back()}
        sx={{ color: "#fff", fontWeight: 500, mt: 1 }}
      >
        Go back
      </Button>
    </div>
  );
}
