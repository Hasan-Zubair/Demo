import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid,
  Box,
  IconButton,
  Fab,
  Drawer,
  Container,
  Divider,
} from "@mui/material";
import { ReactComponent as Back } from "../../assets/icons/arrow-right.svg";
import Header from "../../components/Header";
import VeraButton from "../../components/VeraButton";
import CheckBox from "../../components/CheckBox";
import MessageModal from "../../common/MessageModal";
import moment from "moment";
import { ReactComponent as AddIcon } from "../../assets/add-icon.svg";
import Documents from "./components/Documents";
import SharedDocuments from "./components/SharedDocuments";
import Description from "./components/Description";
import AddNewTaskModal from "../Dashboard/components/AddNewTaskModal";
import axios from "axios";
import ChatBox from "../../components/Chat";
import Player from "../../components/Player";
import Payments from "./components/Payments";
// style & Assets
import styles from "./details.module.scss";
import ConfirmationModal from "../../common/ConfirmationsModal";
import { ReactComponent as Delete } from "../../assets/dashboard/trash.svg";
import { ReactComponent as Edit } from "../../assets/dashboard/edit.svg";
import { ReactComponent as BotIcon } from "../../assets/icons/message-circle.svg";
import UpdateTaskModal from "../Dashboard/components/UpdateTaskModal";

const DetailsPage = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [taskData, setTaskData] = useState(null);
  const [isBtnModalLoading, setIsBtnModalLoading] = useState(false);
  const [isCaseClosedModal, setIsCaseClosedModal] = useState(false);
  const [taskCheckBox, setTaskCheckBox] = useState(null);
  const [isCaseCloseModal, setIsCaseCloseModal] = useState(false);
  const [open, setOpen] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [taskStatus, setTaskStatus] = useState(null);
  const [isTaskPopoverVisible, setIsTaskPopoverVisible] = useState(false);
  const [hoveredTask, setHoveredTask] = useState(null);
  const [openDeleteConfirmationModal, setDeleteConfirmationModal] =
    useState(false);
  const [isTaskUpdateModal, setIsTaskUpdateModal] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("LoggedInObj"));
  const { caseID } = useParams();
  const renderUI = () => {
    if (windowWidth >= 1200) {
      return (
        <Grid
          item
          lg={2.8}
          xl={2.8}
          className={`${styles.chat} ${!data?.lawyer ? styles.disabled : ""}`}
        >
          <ChatBox
            caseID={caseID}
            status={data?.status}
            lawyer={data?.lawyer}
            handleClose={handleClose}
          />
        </Grid>
      );
    } else {
      return (
        <Drawer
          PaperProps={{
            sx: { width: "100%" },
          }}
          item
          xs={12}
          md={3}
          anchor={"right"}
          open={open}
          onClose={handleClose}
        >
          <ChatBox
            caseID={caseID}
            status={data?.status}
            lawyer={data?.lawyer}
            handleClose={handleClose}
          />
        </Drawer>
      );
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClose = () => {
    setOpen(null);
  };

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setOpen(screenWidth >= 1200);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleChatbox = () => {
    setOpen(true);
    getData(caseID);
  };

  const getData = async (caseID) => {
    await axios
      .get(`${process.env.REACT_APP_BASE_API_URL}api/auth/case/${caseID}`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {});
  };
  const getTasksData = async (caseID) => {
    await axios
      .get(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/case/task/?case=${caseID}`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        },
      )
      .then((res) => {
        setTaskData(res.data.results);
        setIsAddTaskModalOpen(false);
      })
      .catch(() => {});
  };
  const updateTasksStatus = async (taskId, status) => {
    await axios
      .put(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/case/task/${taskId}/`,
        {
          status: status,
        },
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        },
      )
      .then(() => {
        getTasksData(caseID);
      })
      .catch(() => {});
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    getData(caseID);
    getTasksData(caseID);
  }, []);

  const updateCaseStatus = async (caseId, caseStatus) => {
    try {
      setIsBtnModalLoading(true);
      await axios
        .put(
          `${process.env.REACT_APP_BASE_API_URL}api/auth/case/${caseId}/`,
          {
            status: caseStatus,
          },
          {
            headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
            },
          },
        )
        .then(() => {
          getData(caseID);
          setIsBtnModalLoading(false);
          setIsCaseClosedModal(true);
        });
    } catch (e) {
      console.log("error ");
    }
  };

  const handleTaskMouseEnter = (task) => {
    setHoveredTask(task);
    setIsTaskPopoverVisible(true);
  };

  const handleTaskMouseLeave = () => {
    setIsTaskPopoverVisible(false);
  };

  const getCaseTasks = async (caseId) => {
    getData(caseID);
    getTasksData(caseID);
    setIsTaskUpdateModal(false);
  };

  const deleteTask = async (taskId) => {
    await axios
      .delete(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/case/task/${taskId}/`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        },
      )
      .then((res) => {
        getData(caseID);
        getTasksData(caseID);
        setDeleteConfirmationModal(false);
      })
      .catch((err) => {});
  };

  const listProps = (el) =>
    userInfo?.type === "client"
      ? {}
      : {
          onMouseEnter: () => handleTaskMouseEnter(el),
          onMouseLeave: handleTaskMouseLeave,
        };

  return (
    <>
      <div style={{ backgroundColor: "#F3F3F3", minHeight: "100vh" }}>
        <div
          style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}
        >
          <Header />
        </div>

        <Grid className={styles.bar}>
          <div className={styles.header}>
            <div className={styles.actions}>
              <h3>
                <Back
                  className={styles.back}
                  onClick={() => {
                    if (userInfo?.type === "admin") {
                      navigate("/admin/dashboard");
                    } else if (userInfo?.type === "lawyer") {
                      navigate("/dashboard/lawyer");
                    } else {
                      navigate("/dashboard");
                    }
                  }}
                />
                Engagement Details
              </h3>
              <div className={styles.buttons}>
                <a
                  href={`mailto:legalEase@legalease.pk?subject=LegalEase Issue ${data?.case_id}`}
                >
                  <VeraButton variant="outlined">Raise an Issue</VeraButton>
                </a>
                {userInfo?.type === "lawyer" || userInfo?.type === "admin"
                  ? (data?.status === "open" ||
                      data?.status === "in_progress") && (
                      <VeraButton
                        variant="contained"
                        onClick={() => {
                          setIsCaseCloseModal(true);
                        }}
                      >
                        Close this Case
                      </VeraButton>
                    )
                  : ""}
              </div>
            </div>
          </div>
        </Grid>

        <Grid
          container
          className={
            userInfo?.type === "admin"
              ? styles.mainWrapperAdmin + " " + styles.adminPad_o
              : styles.mainWrapper
          }
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={6}
            xl={6}
            className={styles.details}
          >
            <Grid style={{ padding: "0px 0px 10px 0px" }}>
              <Container className={styles.containerBackground}>
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    className={
                      data?.status === "closed" || data?.status === "locked"
                        ? styles.infoWrapper + " " + styles.disabled
                        : styles.infoWrapper
                    }
                  >
                    <Grid container className={styles.overflowWrap}>
                      {userInfo?.type === "admin" ? (
                        <>
                          <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                            <div className={styles.info}>
                              <h3>ID</h3>
                              {data?.case_id}
                            </div>
                          </Grid>

                          <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                            <div className={styles.info}>
                              <h3>
                                {userInfo?.type === "client"
                                  ? "Service Provider"
                                  : "Client Name"}
                              </h3>
                              {userInfo?.type === "client"
                                ? data?.lawyer
                                  ? data?.lawyer
                                  : "Not Assigned"
                                : data?.client}
                            </div>
                          </Grid>

                          {userInfo?.type === "admin" && (
                            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                              <div className={styles.info}>
                                <h3>Service Provider</h3>
                                {data?.lawyer ? data?.lawyer : "Not Assigned"}
                              </div>
                            </Grid>
                          )}

                          <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                            <div className={styles.info}>
                              <h3>Query Date</h3>
                              {moment(data?.created_at).format("ll")}
                            </div>
                          </Grid>

                          <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                            <div className={styles.info}>
                              <h3>Status</h3>
                              <span
                                className={
                                  data?.status === "open"
                                    ? styles.open
                                    : data?.status === "closed"
                                    ? styles.closed
                                    : data?.status === "in_progress"
                                    ? styles.progress
                                    : data?.status === "locked"
                                    ? styles.locked
                                    : styles.open
                                }
                              >
                                {data?.status}
                              </span>
                            </div>
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                            <div className={styles.info}>
                              <h3>ID</h3>
                              {data?.case_id}
                            </div>
                          </Grid>

                          <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                            <div className={styles.info}>
                              <h3>
                                {userInfo?.type === "client"
                                  ? "Service Provider"
                                  : "Client Name"}
                              </h3>
                              {userInfo?.type === "client"
                                ? data?.lawyer
                                  ? data?.lawyer
                                  : "Not Assigned"
                                : data?.client}
                            </div>
                          </Grid>

                          {userInfo?.type === "admin" && (
                            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                              <div className={styles.info}>
                                <h3>Service Provider</h3>
                                {data?.lawyer ? data?.lawyer : "Not Assigned"}
                              </div>
                            </Grid>
                          )}

                          <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                            <div className={styles.info}>
                              <h3>Query Date</h3>
                              {moment(data?.created_at).format("ll")}
                            </div>
                          </Grid>

                          <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                            <div className={styles.info}>
                              <h3>Status</h3>
                              <span
                                className={
                                  data?.status === "open"
                                    ? styles.open
                                    : data?.status === "closed"
                                    ? styles.closed
                                    : data?.status === "in_progress"
                                    ? styles.progress
                                    : data?.status === "locked"
                                    ? styles.locked
                                    : styles.open
                                }
                              >
                                {data?.status}
                              </span>
                            </div>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                <Divider />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    {data?.description && (
                      <>
                        <div
                          className={
                            data?.status === "locked" ||
                            data?.status === "closed"
                              ? "disabled"
                              : ""
                          }
                        >
                          <h3>Description</h3>
                          <div className={styles.job}>
                            <b>Job:</b> {data?.category}
                          </div>
                          <Description data={data?.description} />
                        </div>
                      </>
                    )}

                    {data?.voice_note && (
                      <Box
                        my={3}
                        pr={4}
                        className={
                          data?.status === "closed" || data?.status === "locked"
                            ? "disabled"
                            : ""
                        }
                      >
                        <Player audioURL={data?.voice_note} />
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Container>
            </Grid>

            <Grid style={{ padding: "0px 0px 10px 0px" }}>
              <Container className={styles.containerBackground}>
                <Documents status={data?.status} caseId={caseID} />
                {userInfo?.type !== "admin" && (
                  <SharedDocuments status={data?.status} caseId={caseID} />
                )}
              </Container>
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={3.5}
            xl={3.5}
            className={`${styles.details} ${styles.customPadding}`}
          >
            <Grid style={{ padding: "0px 0px 10px 0px" }}>
              <Container className={styles.containerBackground}>
                <Box
                  className={
                    data?.status === "locked" || data?.status === "closed"
                      ? styles.disabled + " " + styles.taskList
                      : styles.taskList
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <h3>Task List</h3>

                    {userInfo?.type === "lawyer" && (
                      <VeraButton
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          margin: "20px 0px",
                        }}
                        variant="text"
                        onClick={() => setIsAddTaskModalOpen(true)}
                      >
                        <AddIcon /> Add Tasks
                      </VeraButton>
                    )}
                  </div>

                  <div className={styles.taskContainer}>
                    {taskData?.length > 0 ? (
                      <ul>
                        {taskData?.map((el, i) => (
                          <li
                            key={el.id}
                            {...listProps(el)}
                            className={styles.taskListItem} // Add a CSS class for styling
                          >
                            <label className={styles.checkboxLabel}>
                              <CheckBox
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    updateTasksStatus(el.id, "closed");
                                    setTaskStatus("Task closed successfully.");
                                    setTaskCheckBox(el.id);
                                  } else {
                                    setTaskCheckBox(null);
                                    updateTasksStatus(el.id, "open");
                                    setTaskStatus("Task opened successfully.");
                                  }
                                }}
                                checked={el.status === "closed"}
                              />
                            </label>
                            <span
                              className={
                                el.status === "closed" ? styles.strike : ""
                              }
                            >
                              {el.title}: {el?.description}
                              {isTaskPopoverVisible &&
                                hoveredTask.id === el.id && (
                                  <div className={styles.hoveredBox}>
                                    <div className={styles.actions}>
                                      <IconButton
                                        onClick={() => {
                                          setHoveredTask(el);
                                          setDeleteConfirmationModal(true);
                                        }}
                                      >
                                        <Delete />
                                      </IconButton>
                                      <IconButton
                                        onClick={() => {
                                          setHoveredTask(el);
                                          setIsTaskUpdateModal(true);
                                        }}
                                      >
                                        <Edit />
                                      </IconButton>
                                    </div>
                                  </div>
                                )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No Tasks Found</p>
                    )}
                  </div>
                </Box>
              </Container>
            </Grid>

            <Grid style={{ padding: "0px 0px 10px 0px" }}>
              <Payments data={data} />
            </Grid>
          </Grid>

          {!data?.lawyer ? (
            <Fab
              color="primary"
              className={`${styles.iconDisabled}`}
              onClick={toggleChatbox}
            >
              <BotIcon />
            </Fab>
          ) : (
            <Fab
              color="primary"
              className={`${styles.toggle}`}
              onClick={toggleChatbox}
            >
              <BotIcon />
            </Fab>
          )}

          {renderUI()}
        </Grid>

        <ConfirmationModal
          open={isCaseCloseModal}
          onClose={setIsCaseCloseModal}
          error
          onConfirm={() => {
            updateCaseStatus(caseID, "closed");
          }}
          title={"Close the case"}
          isBtnLoading={isBtnModalLoading}
          content={"Are you sure you want to close the case?"}
        />
        <MessageModal
          open={isTaskModalOpen}
          onClose={setIsTaskModalOpen}
          title="Task Status Updated"
          content={taskStatus}
        />
        <MessageModal
          open={isCaseClosedModal}
          onClose={setIsCaseClosedModal}
          title="Case closed"
          error
          content={"Case is closed successfully"}
          moveToDashboard={"lawyer"}
        />
        <AddNewTaskModal
          open={isAddTaskModalOpen}
          setOpen={setIsAddTaskModalOpen}
          caseId={caseID}
          getData={getData}
          getTasksData={getTasksData}
        />
        <ConfirmationModal
          open={openDeleteConfirmationModal}
          onClose={setDeleteConfirmationModal}
          title="Delete Task"
          // isBtnLoading={isConfirmBtnLoading}
          content="Are you sure you want to delete this task?"
          onConfirm={() => {
            deleteTask(hoveredTask?.id);
          }}
        />
        <UpdateTaskModal
          open={isTaskUpdateModal}
          setOpen={setIsTaskUpdateModal}
          currentTask={hoveredTask}
          currentCase={data}
          getCaseTasks={getCaseTasks}
        />
      </div>
    </>
  );
};

export default DetailsPage;
