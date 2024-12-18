import React from "react";
import { Box, Typography, Button } from "@mui/material";
import notConnectedImage from "../../../../assets/not-connected.jpg";

const NotConnected = ({ setScreen }) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"space-between"}
      gap={1}
      alignItems={"center"}
      textAlign={"center"}
    >
      <Box
        component={"img"}
        src={notConnectedImage}
        alt={"not connected"}
        loading="lazy"
        maxWidth={"400px"}
      />
      <Typography variant="h4" fontWeight={600}>
        Oops!, Stripe Account Not Linked.
      </Typography>
      <Typography marginBottom={3}>
        Click to create and link your stripe account.
      </Typography>
      <Button variant="contained" onClick={() => setScreen("select_type")}>
        Create Account
      </Button>
    </Box>
  );
};
export default NotConnected;
