import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";

const PublicHeader = () => {
  const [navbar, setNavbar] = useState(
    window.innerWidth < 500 ? "mobile" : "desktop"
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setNavbar("mobile");
      } else {
        setNavbar("desktop");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line
  }, [window.innerWidth]);

  return navbar === "mobile" ? (<MobileNavbar />) : (<Navbar />)
}

export default PublicHeader;
