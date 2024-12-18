import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
import Profile from "./comps/Profile";
import NotConnected from "./comps/NotConnected";
import AccountType from "./comps/AccountType";
import Individual from "./comps/Individual";
import Company from "./comps/Company";
import UpdateCompany from "./comps/update/UpdateCompany";
import UpdatePerson from "./comps/update/UpdatePerson";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "../../../utils/axios";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const StripeAccount = () => {
  const [screen, setScreen] = useState("not_connected");
  const [accountExist, setAccountExist] = useState([]);
  const [loading, setLoading] = useState(false);

  const getStripeAccountInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/integration/stripe/`,
      );
      setAccountExist(response.data.data);
      setScreen("created");
    } catch (error) {
      setScreen("not_connected");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStripeAccountInfo();
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case "not_connected":
        return <NotConnected setScreen={setScreen} />;
      case "select_type":
        return <AccountType setScreen={setScreen} />;
      case "individual":
        return (
          <Elements stripe={stripePromise}>
            <Individual
              getStripeAccountInfo={getStripeAccountInfo}
              formType={screen}
              setScreen={setScreen}
            />
          </Elements>
        );
      case "company":
        return (
          <Elements stripe={stripePromise}>
            <Company
              getStripeAccountInfo={getStripeAccountInfo}
              formType={screen}
              setScreen={setScreen}
            />
          </Elements>
        );
      case "update_individual":
        return (
          <UpdatePerson
            getStripeAccountInfo={getStripeAccountInfo}
            account={accountExist}
            setScreen={setScreen}
          />
        );
      case "update_company":
        return (
          <UpdateCompany
            getStripeAccountInfo={getStripeAccountInfo}
            account={accountExist}
            setScreen={setScreen}
          />
        );
      case "created":
        return (
          <Profile
            getStripeAccountInfo={getStripeAccountInfo}
            account={accountExist}
            setScreen={setScreen}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box
        maxWidth={{ md: "800px" }}
        marginX={"auto"}
        paddingY={5}
        minHeight={300}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={32} />
      </Box>
    );
  }

  return (
    <Box maxWidth={{ md: "800px" }} marginX={"auto"} paddingY={5}>
      {renderScreen()}
    </Box>
  );
};

export default StripeAccount;
