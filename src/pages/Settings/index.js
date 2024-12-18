import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Container from "../../components/Container";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import styles from "./settings.module.scss";
import StripeAccount from "./StripeAccount";
import ProfileSettings from "./ProfileSettings";
import { useLocation } from "react-router-dom";

const Settings = () => {
  const location = useLocation();
  const stateData = location.state;

  const [value, setValue] = useState("2");
  const userInfo = JSON.parse(localStorage.getItem("LoggedInObj"));
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const lawyer = userInfo?.type === "lawyer";

  useEffect(() => {
    if (userInfo?.type === "lawyer" || userInfo?.type === "admin" || userInfo?.type === "client") {
      setValue("1");
    }
    if (stateData?.tabValue) {
      setValue("2");
    }
  }, []);

  return (
    <>
      <Header />
      <Container>
        <Box
          sx={{ width: "100%" }}
          className={
            JSON.parse(localStorage.getItem("LoggedInObj"))?.type === "admin"
              ? styles.pad_60
              : ""
          }
        >
          <TabContext value={value}>
            <Box className={styles.settingPageTabs}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Profile Settings" value="1" />
                {lawyer ? <Tab label="Stripe Account" value="2" /> : null}
              </TabList>
            </Box>
            <TabPanel value="1">
              <ProfileSettings />
            </TabPanel>
            {lawyer ? (
              <TabPanel value="2">
                <StripeAccount />
              </TabPanel>
            ) : null}
          </TabContext>
        </Box>
      </Container>
    </>
  );
};

export default Settings;
