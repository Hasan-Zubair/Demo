import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { Box } from "@mui/material";
import styles from "./Blogs.module.scss";
import ContactForm from "../../components/ContactForm";
import Footer from "../../components/Footer";
import MobileNavbar from "../../components/MobileNavbar";
import useMediaQuery from "@mui/material/useMediaQuery";

const Blogs = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(0);

  useEffect(() => {
    let prevHeight = 0;

    const handleMessage = (event) => {
      if (event.data && event.data.documentHeight) {
        const currentLocation = event?.data?.currentLocation;
        const websiteUrlLocation = window.location.href;

        let split = websiteUrlLocation?.split('?');

        if (split[1] && prevHeight !== event.data.documentHeight) {
          window.history.replaceState({}, "b", `/blogs`);
        }

        if (currentLocation && !split[1]) {
          const fields = currentLocation?.split('?');
          if (fields[1]) {
            window.history.replaceState({}, "b", `?${fields[1]}`);
          }
        }

        prevHeight = event.data.documentHeight;
        setIframeHeight(event.data.documentHeight);
        setIsLoaded(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const mobile = useMediaQuery("(max-width: 600px)");

  return (
    <div>
      {mobile ? <MobileNavbar /> : <Navbar />}
      <Box className={styles.iframe_container}>
        <iframe
          src="https://blog.veralegal.uk/"
          frameborder="0"
          x-frame-options="SAMEORIGIN"
          title="blogs"
          id="i_frame"
          allowfullscreen
          style={{
            height: iframeHeight
          }}
        />
      </Box>
      {isLoaded && (
        <>
          <ContactForm />
          <Footer />
        </>
      )}
    </div>
  );
};

export default Blogs;
