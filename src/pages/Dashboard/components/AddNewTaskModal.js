import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import styles from "./component.module.scss";
import axios from "axios";
import Alert from "@mui/material/Alert";

import { TextField } from "@mui/material";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function AddNewTaskModal({
  open,
  setOpen,
  caseId,
  getData,
  getTasksData,
}) {
  const handleClose = () => setOpen(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [date, setDate] = React.useState("");
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isFailure, setIsFailure] = React.useState(false);
  const [description, setDescription] = React.useState("");

  const sendData = async () => {
    setIsLoading(true);
    await axios
      .post(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/case/task/`,

        {
          title: title,
          case: caseId,
          description: description,
        },
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        },
      )
      .then((res) => {
        setIsLoading(false);
        handleClose();
        setIsSuccess(true);
        setIsFailure(false);
        setDate("");
        setDescription("");
        setTimeout(() => {
          setIsSuccess(false);
        }, 2000);
        getTasksData(caseId);
        setTitle("");
      })
      .catch((err) => {
        setIsLoading(false);
        setIsFailure(true);
        setDate("");
        setDescription("");
        setTitle("");
        setIsSuccess(false);
      });
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography
              id="transition-modal-title"
              variant="h6"
              fontWeight="bold"
              component="h2"
            >
              Add New Task
            </Typography>
            {isSuccess && (
              <Box my={3}>
                <Alert severity="success">Task Created Successfully.</Alert>
              </Box>
            )}
            {isFailure && <Alert severity="error">Something went wrong</Alert>}
            <Box>
              <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                <Typography variant="body1" color="initial">
                  Title
                </Typography>
                <TextField
                  id="outlined-basic"
                  size="small"
                  fullWidth
                  label=""
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  variant="outlined"
                />
              </Typography>
            </Box>
            <Box>
              <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                <Typography variant="body1" color="initial">
                  Description
                </Typography>
                <TextField
                  id="outlined-basic"
                  size="small"
                  fullWidth
                  label=""
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Typography>
            </Box>
            <Box mt={4}>
              <LoadingButton
                className={isLoading ? "" : styles.add_new_task_modal_btn}
                variant="contained"
                size="medium"
                loading={isLoading}
                onClick={() => {
                  //   checkValidations();
                  //   submitData();
                  sendData();
                }}
                fullWidth
              >
                Add New Task
              </LoadingButton>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
