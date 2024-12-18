import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress from MUI

function Calendly() {
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator

  const storedData = localStorage.getItem("formData");
  const parsedData = JSON.parse(storedData);

  const currentUser = localStorage.getItem("LoggedInObj")
    ? JSON.parse(localStorage.getItem("LoggedInObj"))
    : null;

  const updatedUserName = localStorage.getItem("user_name");

  const combinedData = {
    username:
      updatedUserName ||
      (currentUser ? currentUser.username : parsedData?.fullName),
    email: currentUser?.email || parsedData?.email,
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;

    script.onload = () => {
      if (window.Calendly) {
        window.Calendly.initInlineWidget({
          url: "https://calendly.com/vera-mly",
          parentElement: document.getElementById("calendly-container"),
          prefill: {
            name: combinedData.username,
            email: combinedData.email,
          },
        });

        // Introduce a timeout before hiding the loader
        setTimeout(() => {
          setIsLoading(false); // Calendly has loaded, set loading state to false
        }, 4000); // Adjust the delay as needed
      }
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [combinedData.username, combinedData.email]);

  return (
    <div>
      <div
        id="calendly-container"
        style={{
          minWidth: "320px",
          height: "700px",
          position: "relative",
        }}
      >
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <CircularProgress />
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendly;
