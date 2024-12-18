import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Card, Grid } from "@mui/material";

const data = [
  {
    title: "Individual",
    value: "individual",
    body: "You file taxes as an individual.",
  },
  {
    title: "Company",
    value: "company",
    body: "You file taxes as a business entity registered with a U.S. state as a limited liability company (LLC) that has only one member or owner.",
  },
];

const AccountType = ({ setScreen }) => {
  const [selected, setSelected] = useState("");

  return (
    <Box>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        gap={3}
        alignItems={"center"}
        marginBottom={5}
      >
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Get paid by Vera
          </Typography>
          <Typography>
            Please select your tax reporting classification to continue.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {data.map((item, i) => (
          <Grid key={i} item xs={6}>
            <Card
              sx={{
                border: 1,
                borderColor: selected === item.value ? "primary" : "divider",
                boxShadow: 1,
                padding: 3,
                marginBottom: 3,
                height: 1,
                cursor: "pointer",
              }}
              onClick={() => setSelected(item.value)}
            >
              <Typography variant="h6" marginBottom={1} fontWeight={600}>
                {item.title}
              </Typography>
              <Typography>{item.body}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box display={"flex"} justifyContent={"flex-end"} gap={2} marginTop={3}>
        <Button variant="outlined" onClick={() => setScreen("not_connected")}>
          Back
        </Button>
        <Button
          variant="contained"
          disabled={!selected}
          onClick={() => setScreen(selected)}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default AccountType;
