import React from "react";

// styles
import styles from "./component.module.scss";
import Typography from "@mui/material/Typography";

const Description = ({ data }) => {
  return (
    <div className={styles.taskList}>
      <Typography my={2} variant="body1" color="initial">
        {data}
      </Typography>
    </div>
  );
};

export default Description;
