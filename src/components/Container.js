import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

const Container = ({ children }) => {
  return (
    <Box
      width={1}
      margin={"0 auto"}
      paddingX={{ xs: 3, md: 4, lg: 4, xl: 8 }}
      paddingY={{ xs: 2, md: 4 }}
    >
      {children}
    </Box>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Container;
