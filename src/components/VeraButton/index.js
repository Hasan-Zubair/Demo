import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";

import styles from "./veraBtn.module.scss";

const VeraButton = ({
  children,
  icon,
  iconPosition,
  variant,
  onClick,
  danger,
  style,
  disabled = false,
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      style={style}
      disabled={disabled}
      className={`${styles.veraButton} ${iconPosition && iconPosition} ${
        danger && styles.danger
      }`}
    >
      {icon}
      {children}
    </Button>
  );
};

VeraButton.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.node,
  iconPosition: PropTypes.string,
  variant: PropTypes.string,
  onClick: PropTypes.func,
  danger: PropTypes.bool,
  style: PropTypes.object,
  disabled: PropTypes.bool,
};

export default VeraButton;
