import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  IconButton,
  CircularProgress,
} from "@mui/material";
import VeraButton from "../../../components/VeraButton";
import MessageModal from "../../../common/MessageModal";

// styles & assets
import styles from "./component.module.scss";
import { ReactComponent as UploadIcon } from "../../../assets/icons/upload-icon.svg";
import { ReactComponent as Bin } from "../../../assets/icons/bin-icon.svg";
import axios from "axios";
import { green } from "@mui/material/colors";
import { LoadingButton } from "@mui/lab";

const UploadDoc = ({
  uploadShow,
  files,
  caseId,
  getDoc,
  SharedDocuments,
  setFiles,
  setUploadShow,
  removeFile,
}) => {
  const handleClose = () => {
    // uploadDoc();
    setFiles([]);

    setUploadShow(false);
  };
  const [isdocumentUploaded, setIsDocumentUploaded] = useState(false);
  const inputRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({});
  const allowedFileTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword",
    "text/plain", // .txt files
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx files
    "application/vnd.ms-excel", // .xls files
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx files
    "text/csv", // .csv files
  ];
  const successMessage = {
    description: "Your document has been uploaded successfully",
    title: "Document Uploaded",
  };
  const errorMessage = {
    description: "Your document uploading failed ",
    title: "Uploading Failed",
  };

  const invalidTypeMessage = {
    description: "Your document format is invalid ",
    title: "Invalid Document Type",
  };

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      //   setDragActive(true);
    } else if (e.type === "dragleave") {
      //  setDragActive(false);
      console.log("drag leave");
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    //    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles((files) => [...files, e.dataTransfer.files[0]]);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e) {
    e.preventDefault();
    const selectedFiles = e.target.files;
    const filePromises = Array.from(selectedFiles).map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result;
          const uint8Array = new Uint8Array(arrayBuffer);
          const signature = uint8Array.slice(0, 4).toString();

          // Get the file extension
          const fileExtension = file.name.split(".").pop().toLowerCase();

          if (signature === "8BPS" || fileExtension === "psd") {
            resolve(file);
          } else if (allowedFileTypes.includes(file.type)) {
            resolve(file);
          } else if (!allowedFileTypes.includes(file.type)) {
            reject("fileType");
          }
        };
        reader.onerror = () => {
          reject();
        };
        reader.readAsArrayBuffer(file);
      });
    });

    Promise.all(filePromises)
      .then((validFiles) => {
        setFiles((prevFiles) => [...prevFiles, ...validFiles]);
      })
      .catch((error) => {
        if (error === "fileType") {
          setMessage(invalidTypeMessage);
        } else {
          setMessage(invalidTypeMessage);
        }
        setUploadShow(false);
        setIsDocumentUploaded(true);
      });
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  const isUploadButtonDisabled = files.length === 0 || loading;

  const uploadDoc = async () => {
    setLoading(true);

    try {
      const uploadPromises = files.map((file) => {
        const formData = new FormData();
        formData.append("document", file);
        formData.append("case", caseId);
        formData.append("title", file.name);
        if (SharedDocuments) {
          formData.append("is_public", true);
        }

       return axios
          .post(
            `${process.env.REACT_APP_BASE_API_URL}api/auth/case/document/`,
            formData,
            {
              headers: {
                Authorization: `JWT ${localStorage.getItem("token")}`,
              },
            }
          )
      });

      await Promise.all(uploadPromises)
      setTimeout(() => {
        getDoc()
      },[3000])
      setIsDocumentUploaded(true);
      setUploadShow(false);
      setFiles([]);
      setMessage(successMessage);
    } catch (error) {
      setIsDocumentUploaded(true);
      setLoading(false);
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={uploadShow}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={styles.uploadModal}
      >
        <DialogTitle id="alert-dialog-title">Upload Documents</DialogTitle>
        <input
          ref={inputRef}
          className={styles.inputFileUpload}
          type="file"
          id="input-file-upload"
          multiple={true}
          onChange={handleChange}
        />
        <DialogContent>
          <div
            className={styles.uploadWrapper}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <UploadIcon />
            <h5>
              Drag & drop files or <u onClick={() => onButtonClick()}>Browse</u>
            </h5>
            <p>
              Supported formats: JPEG, PNG, PDF, DOC, DOCX, XLS, XLSX, CSV, TXT
            </p>
          </div>
          <Stack gap={1} className={styles.uploadedDoc}>
            <h5>Uploaded</h5>

            {files.length > 0
              ? files.map((file, index) => {
                  return (
                    <div key={index} className={styles.item}>
                      {file.name}
                      <IconButton onClick={() => removeFile(index)}>
                        <Bin />
                      </IconButton>
                    </div>
                  );
                })
              : "No files Uploaded"}
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            style={
              isUploadButtonDisabled
                ? { background: "grey", color: "white", pointerEvents: "none" }
                : {}
            }
            variant="contained"
            size="large"
            fullWidth
            onClick={() => uploadDoc()}
          >
            UPLOAD FILES
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  color: green[500],
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                  zIndex: 1,
                }}
              />
            )}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <MessageModal
        open={isdocumentUploaded}
        onClose={setIsDocumentUploaded}
        title={message.title}
        content={message.description}
      />
    </>
  );
};

export default UploadDoc;
