import React from "react";
import { Grid, Stack, Chip } from "@mui/material";

// styles
import styles from "./component.module.scss";

const LawyerLawSkills = () => {
  const data = [
    {
      title: "Areas of Law",
      values: ["Label 1", "Label 2"],
    },
  ];

  return (
    <Grid container>
      {data.map((el, i) => (
        <Grid key={i} item md={6} className={styles.taskList}>
          <h4>{el.title}</h4>
          <Stack direction="row" gap={1}>
            {el.values.map((subEl, index) => (
              <Chip key={index} label={subEl} />
            ))}
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
};

export default LawyerLawSkills;
