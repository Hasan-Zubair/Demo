import React from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Grid, Stack, Button, Box, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import PhoneInput from "../../../../../common/phoneNumberStripe";
import MessageModal from "../../../../../common/MessageModal";
import axios from "../../../../../utils/axios";
import { ZipCodeInput } from "../comps";

const phoneRegExp = /^(1\s?)?(\d{3}|\(\d{3}\))[\s\-]?\d{3}[\s\-]?\d{4}$/;

const UpdateCompany = ({ account, setScreen, getStripeAccountInfo }) => {
  const [loading, setLoading] = useState(false);
  const [msgModalData, setMsgModalData] = useState(false);
  const [showError, setShowError] = useState(false);

  const formik = useFormik({
    initialValues: {
      companyName: account?.company?.name,
      companyPhone: account?.company?.phone.replace(/^\+1/, ""),
      companyAddress: account?.company?.address?.line1,
      companyCity: account?.company?.address?.city,
      companyState: account?.company?.address?.state,
      companyZipCode: account?.company?.address?.postal_code,
    },
    validationSchema: Yup.object({
      companyName: Yup.string().required("Company name is required."),
      companyPhone: Yup.string()
        .matches(phoneRegExp, "Phone number is not valid.")
        .required("Phone is required."),
      companyAddress: Yup.string().required("Address is required."),
      companyCity: Yup.string().required("City name is required."),
      companyState: Yup.string().required("County name is required."),
      companyZipCode: Yup.string()
        .min(7, "Postal code is not valid.")
        .required("Postal code is required."),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (data) => {
    setLoading(true);
    setShowError(false);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/integration/stripe/update/`,
        {
          account_id: account.account_id,
          type: "company",
          company: {
            name: data.companyName,
            phone: data.companyPhone,
            address: {
              city: data.companyCity,
              country: "GB",
              line1: data.companyAddress,
              postal_code: data.companyZipCode,
              state: data.companyState,
            },
          },
        },
      );
      setMsgModalData({ title: "Stripe Account", data: response.data.message });
      getStripeAccountInfo();
    } catch (err) {
      let data = err?.response?.data?.message?.map(
        (el, i) => `<p key={${i}}>${el}</p>`,
      );
      setMsgModalData({
        title: "Stripe Account",
        data: data.toString(),
        error: true,
      });
      setShowError(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight={600}>
          Company Information
        </Typography>
        <Typography>Update your company information.</Typography>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item md={12} mb={1}>
            <TextField
              name="companyName"
              value={formik.values.companyName}
              label={
                <>
                  Company name<span style={{ color: "red" }}>*</span>
                </>
              }
              onChange={formik.handleChange}
              error={Boolean(
                formik.touched.companyName && formik.errors.companyName,
              )}
              helperText={
                formik.touched.companyName && formik.errors.companyName
              }
              fullWidth
            />
          </Grid>
          <Grid item md={12} mb={1}>
            <PhoneInput
              autoComplete="off"
              value={formik.values.companyPhone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {() => (
                <TextField
                  id="companyPhone"
                  name="companyPhone"
                  autoComplete="off"
                  label={
                    <>
                      Phone Number<span style={{ color: "red" }}>*</span>
                    </>
                  }
                  placeholder="Eg: 2231231234"
                  type="tel"
                  error={Boolean(
                    formik.touched.companyPhone && formik.errors.companyPhone,
                  )}
                  helperText={
                    formik.touched.companyPhone && formik.errors.companyPhone
                  }
                  sx={{ width: "100%" }}
                />
              )}
            </PhoneInput>
          </Grid>
          <Grid item md={12} mb={1}>
            <TextField
              name="companyAddress"
              label={
                <>
                  Street Address<span style={{ color: "red" }}>*</span>
                </>
              }
              placeholder="Ex: street address"
              onChange={formik.handleChange}
              value={formik.values.companyAddress}
              error={Boolean(
                formik.touched.companyAddress && formik.errors.companyAddress,
              )}
              helperText={
                formik.touched.companyAddress && formik.errors.companyAddress
              }
              fullWidth
            />
          </Grid>
          <Grid item md={5} mb={1}>
            <TextField
              label={
                <>
                  City<span style={{ color: "red" }}>*</span>
                </>
              }
              placeholder="Ex: address"
              name="companyCity"
              onChange={formik.handleChange}
              value={formik.values.companyCity}
              error={Boolean(
                formik.touched.companyCity && formik.errors.companyCity,
              )}
              helperText={
                formik.touched.companyCity && formik.errors.companyCity
              }
              fullWidth
            />
          </Grid>
          <Grid item md={4} mb={1}>
            <TextField
              name="companyState"
              label={
                <>
                  County<span style={{ color: "red" }}>*</span>
                </>
              }
              placeholder="county"
              onChange={formik.handleChange}
              value={formik.values.companyState}
              error={Boolean(
                formik.touched.companyState && formik.errors.companyState,
              )}
              helperText={
                formik.touched.companyState && formik.errors.companyState
              }
              fullWidth
            />
          </Grid>
          <Grid item md={3} mb={1}>
            <ZipCodeInput
              name="companyZipCode"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.companyZipCode}
            >
              {() => (
                <TextField
                  label={
                    <>
                      Postal Code<span style={{ color: "red" }}>*</span>
                    </>
                  }
                  placeholder="zip code"
                  name="companyZipCode"
                  error={Boolean(
                    formik.touched.companyZipCode &&
                      formik.errors.companyZipCode,
                  )}
                  helperText={
                    formik.touched.companyZipCode &&
                    formik.errors.companyZipCode
                  }
                  fullWidth
                />
              )}
            </ZipCodeInput>
          </Grid>
          <Grid item md={12} mb={1}>
            {showError?.length
              ? showError?.map((el, i) => (
                  <Alert
                    severity="error"
                    style={{ marginBottom: "5px" }}
                    key={i}
                  >
                    {el}
                  </Alert>
                ))
              : null}
          </Grid>

          <Grid item md={12} mb={1}>
            <Stack gap={2} direction="row">
              <Button
                variant="outlined"
                sx={{ marginLeft: "auto" }}
                onClick={() => setScreen("created")}
              >
                Back
              </Button>
              <LoadingButton
                loading={loading}
                variant="contained"
                type="submit"
              >
                Update
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
      <MessageModal
        open={msgModalData}
        title={msgModalData?.title}
        content={msgModalData?.data}
        error={msgModalData?.error}
        onClose={setMsgModalData}
      />
    </Box>
  );
};

export default UpdateCompany;
