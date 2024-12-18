/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
import { Box, Typography, Button, Stack, Container, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import VeraButton from "../../../components/VeraButton";
import { ReactComponent as AddIcon } from "../../../assets/add-icon.svg";
import PaymentModal from "./PaymentModal";
import AddPaymentModal from "./AddPaymentModal";
import axios from "../../../utils/axios";
import stripeImage from "./../../../assets/SquareIconBadge.png";

// style & Assets
import styles from "../details.module.scss";

const Payments = ({ data }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [stripeAccount, setStripeAccount] = useState("");
  const { caseID } = useParams();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isStripeAccount, setIsStripeAccount] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("LoggedInObj"));

  const checkStripeAccount = async () => {
    try {
      const response = await axios.get(
        `api/auth/integration/stripe/?case_id=${caseID}`,
      );
      const stripeAccount = response?.data?.data?.account_id;
      setStripeAccount(stripeAccount);
      setIsStripeAccount("has_account");
    } catch (err) {
      setIsStripeAccount("no_account");
    }
  };

  const getPayments = async () => {
    setIsAddPaymentModalOpen(false);
    setPaymentId("");
    setLoading(true);
    try {
      const response = await axios.get(`api/auth/case/payment/?case=${caseID}`);
      setPayments(response?.data?.results);
    } finally {
      setLoading(false);
    }
  };

  // load stripe when stripe account is available
  useEffect(() => {
    if (stripeAccount) {
      let tempStripePromise = loadStripe(
        process.env.REACT_APP_STRIPE_PUBLIC_KEY,
        {
          stripeAccount: stripeAccount,
        },
      );
      setStripePromise(tempStripePromise);
    }
  }, [stripeAccount]);

  useEffect(() => {
    getPayments();
    checkStripeAccount();
  }, []);

  const deletePayment = async (id) => {
    setDelLoading(id);
    try {
      await axios.delete(`api/auth/case/payment/${id}/`);
      getPayments();
    } finally {
      setDelLoading(false);
    }
  };

  return (
    <>
      <Container
        className={
          data?.status === "closed" || data?.status === "locked"
            ? "disabled " + styles.containerBackground
            : styles.containerBackground
        }
      >
        <div className={styles.payment}>
          <h3> Payments </h3>
          {userInfo?.type === "lawyer" && isStripeAccount === "has_account" ? (
            <VeraButton
              style={{
                display: "flex",
                justifyContent: "flex-start",
                margin: "20px 0px",
              }}
              variant="text"
              onClick={() => setIsAddPaymentModalOpen(true)}
            >
              <AddIcon /> Add Payments
            </VeraButton>
          ) : null}
        </div>
        <Grid
          className={
            (userInfo?.type === "lawyer" && isStripeAccount === "has_account") &&
            payments?.length
              ? styles.greyRectangle
              : ""
          }
        >
          {userInfo?.type === "lawyer" && isStripeAccount === "no_account" ? (
            <Stack
              direction={"column"}
              alignItems={"center"}
              justifyContent={"space-between"}
              gap={2}
              width={"100%"}
            >
              <img
                src={stripeImage}
                alt="add Stripe account"
                width="44"
                height="auto"
                style={{ marginTop: "20px" }}
              />
              <Button
                size="small"
                sx={{ py: 0.5, marginBottom: "20px" }}
                variant="contained"
                onClick={() => navigate("/settings", {state: {tabValue: "2"}})}
              >
                Connect Stripe Account
              </Button>
              {/* <Typography>No Stripe account connected.</Typography> */}

              {/* {loading ? (
                <Typography variant="body2">Loading payments...</Typography>
              ) : null} */}
            </Stack>
          ) : null}
          {payments?.length && isStripeAccount === "has_account"? (
            payments.map((pay, i) => (
              <Box className={styles.paymentBox} key={i}>
                <Box className={styles.info}>
                  <label>
                    {pay.status === "pending" ? "Pending" : "Invoice"} #{pay.id}
                  </label>
                  <Typography variant="body2">
                    {pay.status === "pending" ? "Due date: " : "Payment date: "}
                    {pay.due_date}
                  </Typography>
                </Box>
                <Box>
                  <label>{pay.amount}$</label>
                  {pay.status === "pending" && userInfo?.type === "lawyer" ? (
                    <LoadingButton
                      variant="contained"
                      color="error"
                      sx={{ ml: 2 }}
                      size="small"
                      loading={delLoading === pay.id}
                      onClick={() => deletePayment(pay.id)}
                    >
                      Delete
                    </LoadingButton>
                  ) : null}

                  {pay.status === "pending" && userInfo?.type === "client" ? (
                    <Button
                      variant="contained"
                      sx={{ ml: 2 }}
                      size="small"
                      onClick={() => {
                        setIsPaymentModalOpen(true);
                        setPaymentId(pay.id);
                      }}
                    >
                      Pay
                    </Button>
                  ) : null}

                  {pay.status !== "pending" ? (
                    <button className={styles.paidBtn}>Paid</button>
                  ) : null}
                </Box>
              </Box>
            ))
          ) : !loading ? (
            <Typography
              variant="body2"
              style={{ marginBottom: "20px", display: "none" }}
            >
              No payments available.
            </Typography>
          ) : null}
        </Grid>
      </Container>

      {isAddPaymentModalOpen ? (
        <AddPaymentModal
          open={isAddPaymentModalOpen}
          setOpen={setIsAddPaymentModalOpen}
          getPayments={getPayments}
        />
      ) : null}

      {isPaymentModalOpen ? (
        <Elements stripe={stripePromise}>
          <PaymentModal
            open={isPaymentModalOpen}
            setOpen={setIsPaymentModalOpen}
            getPayments={getPayments}
            casePaymentId={paymentId}
          />
        </Elements>
      ) : null}
    </>
  );
};

export default Payments;
