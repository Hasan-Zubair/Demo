import React from "react";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ReactComponent as Back } from "../../assets/icons/arrow-right.svg";
import Header from "../../components/Header";
import VeraButton from "../../components/VeraButton";

import Documents from "./components/Documents";
import LawyerLawSkills from "./components/LawyerLawSkills";
import Description from "./components/Description";
import ChatBox from "../../components/Chat";

// style & Assets
import styles from "./details.module.scss";

const LawyerDetailsPage = () => {
  const navigate = useNavigate();
  // get caseId from url

  const dummyData = [
    {
      label: "Query Received Date",
      value: "March 23, 2022",
    },
    {
      label: "Due Date",
      value: "March 23, 2023",
    },
    {
      label: "Stage",
      value: "Active",
    },
    {
      label: "Total Fee",
      value: "$ 20,000",
    },
  ];
  return (
    <>
      <Header />
      <Grid container className={styles.mainWrapper}>
        <Grid item md={9} className={styles.details}>
          <div className={styles.header}>
            <div className={styles.actions}>
              <h3>
                <Back
                  className={styles.back}
                  onClick={() => navigate("/dashboard")}
                />
                Application Details
              </h3>
              <div className={styles.buttons}>
                <VeraButton variant="outlined">Contact Vera</VeraButton>
                <VeraButton variant="contained" icon={<AddIcon />}>
                  Mark as Complete
                </VeraButton>
              </div>
            </div>
            <div className={styles.job}>
              <b>Job:</b> Documentation Review
            </div>
          </div>

          <div className={styles.infoWrapper}>
            {dummyData.map((el, i) => (
              <div key={i} className={styles.info}>
                <label>{el.label}</label>
                {el.value}
              </div>
            ))}
          </div>
          <Description />
          <LawyerLawSkills />
          <Documents />
        </Grid>
        <Grid item md={3} className={styles.chat}>
          {/* <ChatBox caseId={case}/> */}
        </Grid>
      </Grid>
    </>
  );
};

export default LawyerDetailsPage;
