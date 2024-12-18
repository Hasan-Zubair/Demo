import React from "react";
import { FormGroup, FormControlLabel } from "@mui/material";
import CheckBox from "../../../components/CheckBox";

// styles
import styles from "./component.module.scss";

const TaskList = () => {
  return (
    <div className={styles.taskList}>
      <h4>Task List</h4>
      <FormGroup>
        <FormControlLabel
          control={<CheckBox defaultChecked />}
          label="Amet minim mollit non deserunt ullamco est sit"
        />
        <FormControlLabel
          control={<CheckBox />}
          label="Amet minim mollit non deserunt ullamco est sit"
        />
        <FormControlLabel
          control={<CheckBox />}
          label="Amet minim mollit non deserunt ullamco est sit"
        />
      </FormGroup>
    </div>
  );
};

export default TaskList;
