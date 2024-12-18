import React from "react";
import { PropTypes } from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  IconButton,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";

import Box from "@mui/material/Box";
import { Markup } from "interweave";
import "./common.scss";

const ConfirmationModal = ({
  open,
  title,
  content,
  onClose,
  onConfirm,
  error,
  isBtnLoading,
}) => {
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

        <div className="buttons">
          <Button
            variant="contained"
            onClick={() => {
              onClose(false);
            }}
            className="cancel"
          >
            Cancel
          </Button>
          <LoadingButton
            loading={isBtnLoading}
            className="confirm"
            variant="contained"
            onClick={() => {
              onConfirm();
            }}
          >
            Confirm
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

ConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  error: PropTypes.bool,
  isBtnLoading: PropTypes.bool,
};

export default ConfirmationModal;
