import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./reduxStore/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Helmet, HelmetProvider } from "react-helmet-async";
import favIcon from "../src/assets/icons/favicon.png"

const HelmetContext = {};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

  // client's account
  <GoogleOAuthProvider clientId="1060633289350-8gmod15dshfsbl9i6tfg5tn5j9oi2lcm.apps.googleusercontent.com">
    {/* <React.StrictMode> */}
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <HelmetProvider context={HelmetContext}>
        <Helmet>
          <meta charSet="utf-8" />
          <link rel="icon" src={favIcon} />
          <title>LegalEase</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta name="description" content="Legal Services for Everyone." />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap"
            rel="stylesheet"
          />
          <link rel="canonical" href="https://app.veralegal.uk/" />
        </Helmet>
        <App />
      </HelmetProvider>
      {/* </PersistGate> */}
    </Provider>
    {/* </React.StrictMode> */}
  </GoogleOAuthProvider>
);