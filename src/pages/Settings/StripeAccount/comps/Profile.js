/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Card, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import dayjs from "dayjs";
import MessageModal from "../../../../common/MessageModal";
import axios from "../../../../utils/axios";
import StripeErrors from "./StripeErrors";
import { accountMessages } from "./stripeMessages";

const Profile = ({ getStripeAccountInfo, account, setScreen }) => {
  const [confirmation, setConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msgModalData, setMsgModalData] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const deLinkAccount = async () => {
    setLoading(true);
    try {
      const result = await axios.delete("api/auth/integration/stripe/delete/");
      setConfirmation(false);
      setMsgModalData({
        title: "Removing Account",
        data: `<p>${result?.data?.message}</p>`,
      });
      setDeleted(true);
    } catch (err) {
      setMsgModalData({
        title: "Removing Account",
        data: `<p>${
          err?.response?.data?.message || err?.response?.data?.detail
        }</p>`,
        error: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deleted) {
      setTimeout(() => {
        getStripeAccountInfo();
      }, 60000);
    }
  }, [deleted]);

  const returnError = (error) => {
    const subString = error.substring(error.indexOf("."));
    const obj = accountMessages.find((el) => el.name === subString);
    return obj ? obj.message : stripeErrorsReturn(error);
  };

  const stripeErrorsReturn = (error) => {
    const obj = account.errors.find((el) => el.requirement === error);
    return obj ? obj.reason : error;
  };

  const confirmationModal = () => {
    return (
      <Dialog open={confirmation} fullWidth={true} maxWidth={"sm"}>
        <DialogTitle
          sx={{
            bgcolor: "#d83a52",
            color: "#fff",
          }}
        >
          Remove Stripe Account
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontSize: "18px",
              textAlign: "center",
              mt: 4,
              mb: 1,
            }}
          >
            Are you sure to remove your stripe account?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ gap: 2, px: 2, pb: 2, justifyContent: "center" }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setConfirmation(false)}
          >
            No
          </Button>
          <LoadingButton
            size="small"
            variant="contained"
            loading={loading}
            onClick={deLinkAccount}
          >
            Yes
          </LoadingButton>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      {deleted ? (
        <Box textAlign={"center"}>
          <Typography variant="h4" fontWeight={600}>
            Account Removed.
          </Typography>
          <Typography>You stripe account has been removed.</Typography>
        </Box>
      ) : (
        <Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            gap={3}
            alignItems={"center"}
            marginBottom={5}
          >
            <Box>
              <Typography variant="h4" fontWeight={600}>
                Welcome! {account?.individual?.first_name}{" "}
                {account?.individual?.last_name}&nbsp;
                {account?.status === "active" ? (
                  <Box component={"span"} sx={{ color: "#0073EA" }}>
                    <Tooltip title={account?.status} placement="top">
                      <VerifiedIcon />
                    </Tooltip>
                  </Box>
                ) : (
                  <StripeErrors data={account} />
                )}
              </Typography>
              {account?.status === "active" ? (
                <Typography>
                  Your Stripe account is all set to receive payments.
                </Typography>
              ) : account?.disabled_reason ===
                "requirements.pending_verification" ? (
                <Typography sx={{ color: "#d32f2f", fontSize: "14px" }}>
                  Stripe is currently verifying information that you submitted.
                </Typography>
              ) : (
                <Typography sx={{ color: "#d32f2f", fontSize: "14px" }}>
                  Your Stripe account status is {account?.status}, Please
                  correct/Update the below information:
                  <ul>
                    {account?.currently_due.map((msg, i) => (
                      <>
                        <li key={i}>{returnError(msg)}</li>
                      </>
                    ))}
                  </ul>
                </Typography>
              )}
            </Box>
            <Button onClick={() => setConfirmation(true)}>
              Remove Account
            </Button>
          </Box>

          {account?.company && account?.company?.name ? (
            <Card
              sx={{
                border: 1,
                borderColor: "divider",
                boxShadow: 1,
                padding: 3,
                marginBottom: 3,
              }}
            >
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                gap={3}
                alignItems={"center"}
                marginBottom={3}
              >
                <Typography variant="h5" fontWeight={600}>
                  Company Information
                </Typography>
                <Button onClick={() => setScreen("update_company")}>
                  Change
                </Button>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="overline">Name</Typography>
                  <Typography variant="subtitle2">
                    {account?.company?.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="overline">Phone</Typography>
                  <Typography variant="subtitle2">
                    {account?.company?.phone.replace(/^\+1/, "")}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="overline">City</Typography>
                  <Typography variant="subtitle2">
                    {account?.company?.address?.city}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="overline">State</Typography>
                  <Typography variant="subtitle2">
                    {account?.company?.address?.state}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="overline">Address</Typography>
                  <Typography variant="subtitle2">
                    {account?.company?.address?.line1}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          ) : null}
          {account?.individual ? (
            <Card
              sx={{
                border: 1,
                borderColor: "divider",
                boxShadow: 1,
                padding: 3,
                marginBottom: 3,
              }}
            >
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                gap={3}
                alignItems={"center"}
                marginBottom={3}
              >
                <Typography variant="h5" fontWeight={600}>
                  Personal Information
                </Typography>
                <Button onClick={() => setScreen("update_individual")}>
                  Change
                </Button>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="overline">Name</Typography>
                  <Typography variant="subtitle2">
                    {account?.individual?.first_name}{" "}
                    {account?.individual?.last_name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="overline">Date of Birth</Typography>
                  <Typography variant="subtitle2">
                    {account?.individual?.dob?.day}{" "}
                    {dayjs(account?.individual?.dob?.month).format("MMM")},{" "}
                    {account?.individual?.dob?.year}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="overline">Email</Typography>
                  <Typography variant="subtitle2">
                    {account?.individual?.email}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="overline">Phone</Typography>
                  <Typography variant="subtitle2">
                    {account?.individual?.phone.replace(/^\+1/, "")}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="overline">City</Typography>
                  <Typography variant="subtitle2">
                    {account?.individual?.address?.city}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="overline">State</Typography>
                  <Typography variant="subtitle2">
                    {account?.individual?.address?.state}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="overline">Address</Typography>
                  <Typography variant="subtitle2">
                    {account?.individual?.address?.line1}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          ) : null}
          <Card
            sx={{
              border: 1,
              borderColor: "divider",
              boxShadow: 5,
              padding: 3,
              marginBottom: 3,
            }}
          >
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              gap={3}
              alignItems={"center"}
              marginBottom={3}
            >
              <Typography variant="h5" fontWeight={600}>
                Bank Information
              </Typography>
              <Button disabled={true}>Change</Button>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography variant="overline">Account Holder</Typography>
                <Typography variant="subtitle2">
                  {account?.external_account?.account_holder_name}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="overline">Account Number</Typography>
                <Typography variant="subtitle2">
                  ******{account?.external_account?.last4}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="overline">Routing Number</Typography>
                <Typography variant="subtitle2">
                  {account?.external_account?.routing_number}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Box>
      )}
      {confirmationModal()}
      <MessageModal
        open={msgModalData}
        title={msgModalData?.title}
        content={msgModalData?.data}
        error={msgModalData?.error}
        onClose={setMsgModalData}
      />
    </>
  );
};

export default Profile;
