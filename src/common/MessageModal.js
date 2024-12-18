import React, { useEffect } from "react";
import PropTypes from "prop-types";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
} from "@mui/material";

import Box from "@mui/material/Box";
import { Markup } from "interweave";
import "./common.scss";
import { useNavigate } from "react-router";

const MessageModal = ({
  open,
  title,
  content,
  onClose,
  error,
  timeOut,
  moveToDashboard,
}) => {
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (open) {
  //     setTimeout(
  //       () => {
  //         onClose(false);
  //         if (moveToDashboard) {
  //           if (moveToDashboard === "lawyer") {
  //             navigate(`/dashboard/lawyer`);
  //           }
  //         }
  //       },
  //       timeOut ? timeOut : 3000
  //     );
  //   }
  // }, [open]);

  return (
    <Dialog
      className="vera-success-modal"
      open={open}
      fullWidth={true}
      maxWidth={"sm"}
      onClose={() => onClose(false)}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle className={error && "error"}>
        {title}
        <IconButton
          edge="start"
          sx={{ color: "white" }}
          onClick={() => onClose(false)}
          aria-label="close"
        >
          x{/* <CloseCircleOutlined /> */}
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <Box className="delete-content">
            <Markup content={content} />
          </Box>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

MessageModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  error: PropTypes.bool,
  timeOut: PropTypes.number,
};

export default MessageModal;
