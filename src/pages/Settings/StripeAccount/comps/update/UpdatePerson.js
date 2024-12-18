import React from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Grid, Stack, Button, Box, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Alert from "@mui/material/Alert";
import dayjs from "dayjs";
import PhoneInput from "../../../../../common/phoneNumberStripe";
import MessageModal from "../../../../../common/MessageModal";
import axios from "../../../../../utils/axios";
import { ZipCodeInput } from "../comps";

const phoneRegExp = /^(1\s?)?(\d{3}|\(\d{3}\))[\s\-]?\d{3}[\s\-]?\d{4}$/;

const UpdatePerson = ({ account, setScreen, getStripeAccountInfo }) => {
  const [loading, setLoading] = useState(false);
  const [dob, setDob] = useState(
    `${account.individual.dob.year}-${dayjs(
      account.individual.dob.month,
    ).format("MM")}-${dayjs(account.individual.dob.day).format("DD")}`,
  );
  const [msgModalData, setMsgModalData] = useState(false);
  const [showError, setShowError] = useState(false);

  const formik = useFormik({
    initialValues: {
      personFirstName: account.individual.first_name,
      personLastName: account.individual.last_name,
      personEmail: account.individual.email,
      personDob: `${account.individual.dob.year}-${dayjs(
        account.individual.dob.month,
      ).format("MM")}-${dayjs(account.individual.dob.day).format("DD")}`,
      personPhone: account.individual.phone.replace(/^\+1/, ""),
      personAddress: account.individual.address.line1,
      personCity: account.individual.address.city,
      personState: account.individual.address.state,
      personZipCode: account.individual.address.postal_code,
    },
    validationSchema: Yup.object({
      personEmail: Yup.string()
        .email("Email is not valid.")
        .required("Email is required."),
      personDob: Yup.date().nullable().required("Event date is required."),
      personFirstName: Yup.string().required("First name is required."),
      personLastName: Yup.string().required("Last name is required."),
      personPhone: Yup.string()
        .matches(phoneRegExp, "Phone number is not valid.")
        .required("Phone is required."),
      personAddress: Yup.string().required("Address is required."),
      personCity: Yup.string().required("City name is required."),
      personState: Yup.string().required("County name is required."),
      personZipCode: Yup.string()
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
          type: "individual",
          id: account.individual.id,
          individual: {
            first_name: data.personFirstName,
            last_name: data.personLastName,
            email: data.personEmail,
            phone: data.personPhone,
            address: {
              city: data.personCity,
              line1: data.personAddress,
              postal_code: data.personZipCode,
              state: data.personState,
            },
            dob: {
              day: dayjs(data.personDob).format("DD"),
              month: dayjs(data.personDob).format("MM"),
              year: dayjs(data.personDob).format("YYYY"),
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

  const handelDateSelect = (value) => {
    let formatDate = dayjs(value).format("YYYY-MM-DD");
    formik.values.personDob = formatDate;
    setDob(value);
  };

  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight={600}>
          Personal Information
        </Typography>
        <Typography>Update your personal information.</Typography>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item md={6} mb={1}>
            <TextField
              name="personFirstName"
              label={
                <>
                  First name<span style={{ color: "red" }}>*</span>
                </>
              }
              placeholder="first name"
              onChange={formik.handleChange}
              value={formik.values.personFirstName}
              error={Boolean(
                formik.touched.personFirstName && formik.errors.personFirstName,
              )}
              helperText={
                formik.touched.personFirstName && formik.errors.personFirstName
              }
              fullWidth
            />
          </Grid>
          <Grid item md={6} mb={1}>
            <TextField
              name="personLastName"
              label={
                <>
                  Last name<span style={{ color: "red" }}>*</span>
                </>
              }
              placeholder="last name"
              onChange={formik.handleChange}
              value={formik.values.personLastName}
              error={Boolean(
                formik.touched.personLastName && formik.errors.personLastName,
              )}
              helperText={
                formik.touched.personLastName && formik.errors.personLastName
              }
              fullWidth
            />
          </Grid>
          <Grid item md={8} mb={1}>
            <TextField
              name="personEmail"
              label={
                <>
                  Your email<span style={{ color: "red" }}>*</span>
                </>
              }
              placeholder="Ex: example@mail.com"
              onChange={formik.handleChange}
              value={formik.values.personEmail}
              error={Boolean(
                formik.touched.personEmail && formik.errors.personEmail,
              )}
              helperText={
                formik.touched.personEmail && formik.errors.personEmail
              }
              fullWidth
            />
          </Grid>
          <Grid item md={4} mb={1}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={
                  <>
                    Date of birth<span style={{ color: "red" }}>*</span>
                  </>
                }
                value={dob}
                onChange={(date) => handelDateSelect(date)}
                fullWidth
                format={"YYYY-MM-DD"}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    autoComplete="off"
                    error={Boolean(
                      formik.touched.personDob && formik.errors.personDob,
                    )}
                    helperText={
                      formik.touched.personDob && formik.errors.personDob
                    }
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item md={12} mb={1}>
            <PhoneInput
              autoComplete="off"
              name="personPhone"
              value={formik.values.personPhone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {() => (
                <TextField
                  id="personPhone"
                  name="personPhone"
                  autoComplete="off"
                  label={
                    <>
                      Phone Number<span style={{ color: "red" }}>*</span>
                    </>
                  }
                  placeholder="Eg: 2231231234"
                  type="tel"
                  error={Boolean(
                    formik.touched.personPhone && formik.errors.personPhone,
                  )}
                  helperText={
                    formik.touched.personPhone && formik.errors.personPhone
                  }
                  sx={{ width: "100%" }}
                />
              )}
            </PhoneInput>
          </Grid>

          <Grid item md={12} mb={1}>
            <TextField
              name="personAddress"
              label={
                <>
                  Street Address<span style={{ color: "red" }}>*</span>
                </>
              }
              placeholder="Ex: street address"
              onChange={formik.handleChange}
              value={formik.values.personAddress}
              error={Boolean(
                formik.touched.personAddress && formik.errors.personAddress,
              )}
              helperText={
                formik.touched.personAddress && formik.errors.personAddress
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
              name="personCity"
              onChange={formik.handleChange}
              value={formik.values.personCity}
              error={Boolean(
                formik.touched.personCity && formik.errors.personCity,
              )}
              helperText={formik.touched.personCity && formik.errors.personCity}
              fullWidth
            />
          </Grid>
          <Grid item md={4} mb={1}>
            <TextField
              name="personState"
              label={
                <>
                  County<span style={{ color: "red" }}>*</span>
                </>
              }
              placeholder="county"
              onChange={formik.handleChange}
              value={formik.values.personState}
              error={Boolean(
                formik.touched.personState && formik.errors.personState,
              )}
              helperText={
                formik.touched.personState && formik.errors.personState
              }
              fullWidth
            />
          </Grid>
          <Grid item md={3} mb={1}>
            <ZipCodeInput
              name="personZipCode"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.personZipCode}
            >
              {() => (
                <TextField
                  label={
                    <>
                      Postal Code<span style={{ color: "red" }}>*</span>
                    </>
                  }
                  placeholder="zip code"
                  name="personZipCode"
                  error={Boolean(
                    formik.touched.personZipCode && formik.errors.personZipCode,
                  )}
                  helperText={
                    formik.touched.personZipCode && formik.errors.personZipCode
                  }
                  fullWidth
                />
              )}
            </ZipCodeInput>
          </Grid>
          <Grid item md={12} mb={1}>
            {showError.length
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

export default UpdatePerson;
