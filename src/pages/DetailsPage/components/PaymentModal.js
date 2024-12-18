import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { TextField, IconButton } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import MessageModal from "../../../common/MessageModal";
import axios from "../../../utils/axios";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const PaymentModal = ({ open, setOpen, getPayments, casePaymentId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [messageModal, setMessageModal] = useState(false);

  const handleClose = () => setOpen(false);

  const makeAStripePayment = async () => {
    // validate the name
    if (!name) {
      setNameError(true);
      return;
    }
    setNameError(false);

    // Ensure Stripe and Elements are available
    if (!stripe || !elements) {
      return;
    }
    setLoading(true);

    // Create a payment method using the card element and card holder name
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        name: name,
      },
    });

    if (error) {
      setMessageModal({ content: `<p>${error?.message}</p>`, error: true });
      setLoading(false);
    } else {
      // payment request to server
      if (paymentMethod.id && casePaymentId) {
        try {
          const res = await axios.post(
            `api/auth/case/payment/${casePaymentId}/pay/`,
            {
              payment_method_id: paymentMethod.id,
              card_holder: name,
            },
          );
          setMessageModal({ content: `<p>${res?.data?.message}</p>` });
          getPayments();
        } catch (err) {
          setMessageModal({
            content: `<p>${
              err?.response?.data?.message || err?.response?.data?.detail
            }</p>`,
            error: true,
          });
        } finally {
          setLoading(false);
        }
      }
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
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Payment
          <IconButton onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" marginBottom={1}>
              Your name
            </Typography>
            <TextField
              name="cardHolder"
              size="small"
              fullWidth
              placeholder="e.g. John Doe"
              variant="outlined"
              value={name}
              onChange={(e) => {
                if (e.target.value) {
                  setName(e.target.value);
                  setNameError(false);
                } else {
                  setName("");
                  setNameError(true);
                }
              }}
              error={nameError}
              helperText={nameError && "Name is required."}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" marginBottom={1}>
              Card info
            </Typography>
            <Box
              component={CardElement}
              id="card-element"
              sx={{
                border: 1,
                borderColor: "divider",
                height: 40,
                borderRadius: 1,
                px: 1.5,
                py: 1.3,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <LoadingButton
            variant="contained"
            size="small"
            loading={loading}
            fullWidth
            onClick={makeAStripePayment}
          >
            Pay
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <MessageModal
        open={messageModal}
        onClose={setMessageModal}
        title={"Payment"}
        error={messageModal.error}
        content={messageModal?.content}
      />
    </div>
  );
};

export default PaymentModal;
