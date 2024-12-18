import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

// styles
import styles from "./component.module.scss";

const FilterJobs = ({ currentJobs, setCurrentJobs }) => {
  // const [currentJobs, setCurrentJobs] = useState("alljobs");

  const handleCurrent = (event, newJobs) => {
    setCurrentJobs(newJobs);
  };

  return (
    <ToggleButtonGroup
      className={styles.toggleButton}
      value={currentJobs}
      exclusive
      onChange={handleCurrent}
      aria-label="filter tab"
    >
      <ToggleButton value="alljobs" aria-label="alljobs">
        All Jobs
      </ToggleButton>
      <ToggleButton value="alltasks" aria-label="alltasks">
        All Tasks
      </ToggleButton>
      {/* <ToggleButton value="hiring" aria-label="hiring">
        Hiring
      </ToggleButton>
      <ToggleButton value="inProgress" aria-label="inProgress">
        In Progress
      </ToggleButton>
      <ToggleButton value="completed" aria-label="completed">
        Completed
      </ToggleButton> */}
    </ToggleButtonGroup>
  );
};

export default FilterJobs;
