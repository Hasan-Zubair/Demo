import React, { useState, useEffect } from "react";
import { Container, Grid, Stack } from "@mui/material";
import { IconButton } from "@mui/material";
import VeraButton from "../../../components/VeraButton";
import UploadDoc from "./UploadDoc";
import axios from "axios";
import ConfirmationModal from "../../../common/ConfirmationsModal";
// styles
import { ReactComponent as Delete } from "../../../assets/dashboard/trash.svg";
import { ReactComponent as AddIcon } from "../../../assets/add-icon.svg";
import styles from "./component.module.scss";
import moment from "moment";

const Documents = ({ status, caseId }) => {
  const [uploadShow, setUploadShow] = useState(false);
  const [files, setFiles] = useState([]);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [isConfirmBtnLoading, setIsConfirmBtnLoading] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("LoggedInObj"));
  const getIconSource = (fileExtension) => {
    const lowercaseExtension = fileExtension.toLowerCase();
    switch (lowercaseExtension) {
      case "jpeg":
        return "https://cdn-icons-png.flaticon.com/512/9034/9034358.png";
      case "jpg":
        return "https://cdn-icons-png.flaticon.com/512/11040/11040104.png";
      case "png":
        return "https://cdn-icons-png.flaticon.com/512/9496/9496443.png";
      case "gif":
        return "https://cdn-icons-png.flaticon.com/512/11037/11037544.png";
      case "mp4":
        return "https://cdn-icons-png.flaticon.com/512/11040/11040201.png";
      case "pdf":
        return "https://cdn-icons-png.flaticon.com/512/9496/9496432.png";
      case "psd":
        return "https://cdn-icons-png.flaticon.com/512/9645/9645799.png";
      case "ai":
        return "https://cdn-icons-png.flaticon.com/512/11040/11040131.png";
      case "doc":
        return "https://cdn-icons-png.flaticon.com/512/11040/11040019.png";
      case "docx":
        return "https://cdn-icons-png.flaticon.com/512/11040/11040019.png";
      case "txt":
        return "https://cdn-icons-png.flaticon.com/512/11040/11040074.png";
      case "ppt":
        return "https://cdn-icons-png.flaticon.com/512/10260/10260789.png";
      case "pptx":
        return "https://cdn-icons-png.flaticon.com/512/11040/11040005.png";
      case "xls":
        return "https://cdn-icons-png.flaticon.com/512/4726/4726040.png";
      case "xlsx":
        return "https://cdn-icons-png.flaticon.com/512/4726/4726040.png";
      case "csv":
        return "https://cdn-icons-png.flaticon.com/512/9496/9496460.png";
      default:
        return "https://cdn-icons-png.flaticon.com/512/2504/2504717.png";
    }
  };

  const removeFile = (index) => {
    const allFiles = [...files];
    const delFiles = allFiles.splice(index, 1);
    setFiles(allFiles);
  };
  const getDoc = async () => {
    try {
      await axios
        .get(
          `${process.env.REACT_APP_BASE_API_URL}api/auth/case/document/?case=${caseId}`,
          {
            headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
            },
          },
        )
        .then((res) => {
          const data =
            userInfo.type === "admin"
              ? res.data.data
              : res.data.data.personal_documents;
          setDocuments(data);
        });
    } catch (e) {
      console.log("error ");
    }
  };
  const delDoc = async (id) => {
    try {
      setIsConfirmBtnLoading(true);
      await axios
        .delete(
          `${process.env.REACT_APP_BASE_API_URL}api/auth/case/document/${currentDoc?.id}`,
          {
            headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
            },
          },
        )
        .then((res) => {
          setIsConfirmBtnLoading(false);
          setIsConfirmModal(false);
          getDoc();
        });
    } catch (e) {
      console.log("error ");
      setIsConfirmBtnLoading(false);
      setFiles([]);
    }
  };

  useEffect(() => {
    getDoc();
  }, []);

  return (
    <>
      <Grid
        container
        className={status === "closed" || status === "locked" ? "disabled" : ""}
      >
        {userInfo.type === "admin" ? (
          <>
            <h3>Attachments</h3>
            <Container>
              <Stack direction="column" gap={1}>
                <h4 style={{ color: "#4c5858", fontWeight: "0" }}>
                  Client Documents
                </h4>
              </Stack>
              <Grid container spacing={2} className={styles.uploadedDoc}>
                {documents?.client_documents?.length
                  ? documents?.client_documents.map((file, i) => {
                      const maxTitleLength = 9;
                      const truncatedTitle =
                        file.title.length > maxTitleLength
                          ? file.title.substring(0, maxTitleLength) + "..."
                          : file.title;
                      const fileExtension = file.title.split(".").pop();
                      const imageSrc = getIconSource(fileExtension);
                      return (
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                          <div key={i} className={styles.item}>
                            <div className={styles.itemDiv}>
                              <a
                                href={file.document}
                                target="_blank"
                                style={{
                                  textDecoration: "none",
                                }}
                                rel="noreferrer"
                              >
                                <div style={{ display: "flex" }}>
                                  <img
                                    className={styles.fileImage}
                                    src={imageSrc}
                                    alt={fileExtension}
                                  />
                                  <div>
                                    <label>{truncatedTitle}</label>
                                    <div className={styles.uploaded_at}>
                                      Uploaded on:{" "}
                                      {moment(file.created_at).format("llll")}
                                    </div>
                                  </div>
                                </div>
                              </a>
                              <IconButton
                                onClick={() => {
                                  setIsConfirmModal(true);
                                  setCurrentDoc(file);
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </div>
                          </div>
                        </Grid>
                      );
                    })
                  : ""}
              </Grid>
            </Container>

            <Container>
              <br></br>
              <Stack direction="column" gap={1}>
                <h4 style={{ color: "#4c5858", fontWeight: "0" }}>
                  Lawyer Documents
                </h4>
              </Stack>

              <Grid container spacing={2} className={styles.uploadedDoc}>
                {documents?.lawyer_documents?.length
                  ? documents?.lawyer_documents.map((file, i) => {
                      const maxTitleLength = 9;
                      const truncatedTitle =
                        file.title.length > maxTitleLength
                          ? file.title.substring(0, maxTitleLength) + "..."
                          : file.title;
                      const fileExtension = file.title.split(".").pop();
                      const imageSrc = getIconSource(fileExtension);
                      return (
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                          <div key={i} className={styles.item}>
                            <div className={styles.itemDiv}>
                              <a
                                href={file.document}
                                target="_blank"
                                style={{
                                  textDecoration: "none",
                                }}
                                rel="noreferrer"
                              >
                                <div style={{ display: "flex" }}>
                                  <img
                                    className={styles.fileImage}
                                    src={imageSrc}
                                    alt={fileExtension}
                                  />
                                  <div>
                                    <label>{truncatedTitle}</label>
                                    <div className={styles.uploaded_at}>
                                      Uploaded on:{" "}
                                      {moment(file.created_at).format("llll")}
                                    </div>
                                  </div>
                                </div>
                              </a>
                              <IconButton
                                onClick={() => {
                                  setIsConfirmModal(true);
                                  setCurrentDoc(file);
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </div>
                          </div>
                        </Grid>
                      );
                    })
                  : ""}
              </Grid>
              <br></br>
            </Container>
          </>
        ) : (
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            className={`${styles.taskList} ${styles.documents}`}
          >
            <Stack direction="column" gap={1}>
              <h3
                style={{
                  fontFamily: "Tomato Grotesk, sans-serif",
                  marginTop: "20px",
                  color: "black",
                }}
              >
                Attachments
              </h3>
              <h4>My Documents</h4>
              <VeraButton
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  margin: "10px 0px",
                }}
                variant="text"
                onClick={() => setUploadShow(true)}
              >
                <AddIcon />
                <span style={{ fontWeight: "bold" }}>Add Attachments</span>
              </VeraButton>
            </Stack>
            <br></br>

            <Container>
              <Grid container spacing={2} className={styles.uploadedDoc}>
                {documents?.length > 0
                  ? documents.map((file, i) => {
                      const maxTitleLength = 10;
                      const truncatedTitle =
                        file.title.length > maxTitleLength
                          ? file.title.substring(0, maxTitleLength) + "..."
                          : file.title;
                      const fileExtension = file.title.split(".").pop();
                      const imageSrc = getIconSource(fileExtension);
                      return (
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                          <div key={i} className={styles.item}>
                            <div className={styles.itemDiv}>
                              <a
                                href={file.document}
                                target="_blank"
                                style={{
                                  display: "contents",
                                }}
                                rel="noreferrer"
                              >
                                <div style={{ display: "flex" }}>
                                  <img
                                    className={styles.fileImage}
                                    src={imageSrc}
                                    alt={fileExtension}
                                  />
                                  <div>
                                    <label>{truncatedTitle}</label>
                                    <div className={styles.uploaded_at}>
                                      Uploaded on:{" "}
                                      {moment(file.created_at).format("llll")}
                                    </div>
                                  </div>
                                </div>
                              </a>
                              <IconButton
                                onClick={() => {
                                  setIsConfirmModal(true);
                                  setCurrentDoc(file);
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </div>
                          </div>
                        </Grid>
                      );
                    })
                  : ""}
              </Grid>
            </Container>
          </Grid>
        )}
      </Grid>
      <UploadDoc
        removeFile={removeFile}
        uploadShow={uploadShow}
        getDoc={getDoc}
        files={files}
        caseId={caseId}
        setFiles={setFiles}
        setUploadShow={setUploadShow}
      />
      <ConfirmationModal
        open={isConfirmModal}
        isBtnLoading={isConfirmBtnLoading}
        title={"Delete Document"}
        content={"Are you sure you want to delete this document?"}
        onClose={setIsConfirmModal}
        onConfirm={delDoc}
      />
    </>
  );
};

export default Documents;
