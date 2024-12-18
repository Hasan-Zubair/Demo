import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Stack,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { ReactComponent as Search } from "../../assets/dashboard/search.svg";
import Header from "../../components/Header";
import CasesLawyerTable from "./components/CasesLawyerTable";

import cardData from "./components/cardData";
// components
import VeraButton from "../../components/VeraButton";
import Card from "./components/Card";
// import Filters from "./components/Filters";
import VeraAiBot from "../../components/VeraAIBot";
import DataTable from "./components/DataTable";
import AddNewTaskModal from "./components/AddNewTaskModal";
import axios from "axios";
import { useLocation } from "react-router-dom";

// style
import styles from "./dashboard.module.scss";
import MessageModal from "../../common/MessageModal";

const LawyerDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [dashboardMetrics, setDashboardMetrics] = useState([]);
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const [currentJobs, setCurrentJobs] = useState("alljobs");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Access specific query parameters
  const id__ = searchParams.get("id");

  const getData = async () => {
    if (JSON.parse(localStorage.getItem("LoggedInObj"))?.type === "admin") {
      await axios
        .get(
          `${process.env.REACT_APP_BASE_API_URL}api/auth/admin/new-dashboard/?id=${id__}`,
          {
            headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          cardData[0].value = res.data.data.cases.open;
          cardData[1].value = res.data.data.tasks.open;
          cardData[2].value = res.data.data.tasks.closed;
          setDashboardMetrics([...cardData]);
        })
        .catch((err) => {});
    } else {
      await axios
        .get(`${process.env.REACT_APP_BASE_API_URL}api/auth/case/dashboard/`, {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          cardData[0].value = res.data.data.cases.open;
          cardData[1].value = res.data.data.tasks.open;
          cardData[2].value = res.data.data.tasks.closed;
          setDashboardMetrics([...cardData]);
        })
        .catch((err) => {
          console.log("TCL: getData -> err lawyer", err);
          setErrorMessage(err.response.data.code);
          setIsErrorModal(true);
        });
    }
  };

  useEffect(() => {
    if (localStorage.getItem("LoggedInObj")) {
      const loggedInObj = JSON.parse(localStorage.getItem("LoggedInObj"));
      setUserData(loggedInObj);
      getData();
      const Id = loggedInObj?.id;
      if (Id) {
        axios
          .get(`${process.env.REACT_APP_BASE_API_URL}api/auth/user/${Id}/`, {
            headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            if (res.data.username) {
              setUserName(res.data.name);
            } else {
              setUserName(res.data.username);
            }
          });
      }
    }
  }, []);

  return (
    <>
      <Header />
      <Container className={styles.pageWrapper}>
        <Stack className={`${styles.sectionHeader} ${styles.mb32}`} mb={4}>
          <h1 className={styles.pageTitle}>
            Welcome back
            {userName == null || userName === "" || userName === "null"
              ? " "
              : `, ${userName}`}
          </h1>
        </Stack>
        <Grid
          container
          spacing={3}
          mb={4}
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          {dashboardMetrics?.map((el, i) => (
            <Grid key={i} item xs={12} sm={6} md={4} xl={4}>
              <Card data={el} />
            </Grid>
          ))}
        </Grid>

        <>
          <CasesLawyerTable getDashboardMetircs={getData} />
        </>
      </Container>
      <AddNewTaskModal open={isTaskModalOpen} setOpen={setIsTaskModalOpen} />
      {JSON.parse(localStorage.getItem("LoggedInObj")).type !== "client" && (
        <VeraAiBot />
      )}
      <MessageModal
        open={isErrorModal}
        onClose={setIsErrorModal}
        title="Error"
        error
        content={errorMessage}
      />
    </>
  );
};

export default LawyerDashboard;
