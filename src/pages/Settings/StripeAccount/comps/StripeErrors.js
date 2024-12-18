import React from "react";
import ErrorIcon from "@mui/icons-material/Error";
import { Tooltip, Box } from "@mui/material";

const StripeErrors = ({ data }) => {
  return data?.currently_due.length ? (
    <>
      <Box component={"span"} sx={{ color: "#d32f2f", cursor: "pointer" }}>
        <Tooltip title={data?.status} placement="top">
          <ErrorIcon />
        </Tooltip>
      </Box>
    </>
  ) : null;
};

export default StripeErrors;
