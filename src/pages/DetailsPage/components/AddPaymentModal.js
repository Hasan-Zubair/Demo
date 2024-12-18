import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { TextField, IconButton } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import MessageModal from "../../../common/MessageModal";
import axios from "../../../utils/axios";

const AddPaymentModal = ({ open, setOpen, getPayments }) => {
  const [loading, setLoading] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [messageModal, setMessageModal] = useState(false);
  const { caseID } = useParams();

  const handleClose = () => setOpen(false);

  const formik = useFormik({
    initialValues: {
      fee: "",
      dueDate: "",
    },
    validationSchema: Yup.object({
      fee: Yup.number().required("fee is required."),
      dueDate: Yup.date().nullable().required("due date is required."),
    }),
    onSubmit: (values) => {
      createPayment(values);
    },
  });

  const createPayment = async (values) => {
    setLoading(true);
    try {
      await axios.post("api/auth/case/payment/", {
        case: caseID,
        amount: values.fee,
        due_date: values.dueDate,
      });
      getPayments();
    } catch (err) {
      setMessageModal(`<p>${err?.response?.data?.message[0]}</p>`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Create Payment
            <IconButton onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" marginBottom={1}>
                Fee
              </Typography>
              <TextField
                name="fee"
                type="number"
                size="small"
                fullWidth
                placeholder="e.g. 0.00$"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.fee}
                error={Boolean(formik.touched.fee && formik.errors.fee)}
                helperText={formik.touched.fee && formik.errors.fee}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" marginBottom={1}>
                Payment Due Date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={dueDate}
                  onChange={(newValue) => {
                    let formatDate = dayjs(newValue).format("YYYY-MM-DD");
                    formik.values.dueDate = formatDate;
                    setDueDate(newValue);
                  }}
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      size="small"
                      fullWidth
                      error={Boolean(
                        formik.touched.dueDate && formik.errors.dueDate,
                      )}
                      helperText={
                        formik.touched.dueDate && formik.errors.dueDate
                      }
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <LoadingButton
              variant="contained"
              size="small"
              loading={loading}
              type="submit"
              fullWidth
            >
              Create Payment
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>

      <MessageModal
        open={messageModal}
        onClose={setMessageModal}
        title={"Careate Payment"}
        error={true}
        content={messageModal}
      />
    </div>
  );
};

export default AddPaymentModal;
