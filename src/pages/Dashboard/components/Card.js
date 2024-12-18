import React from "react";
import { IconButton } from "@mui/material";

import { ReactComponent as More } from "../../../assets/icons/more-vertical.svg";
// styles
import styles from "./component.module.scss";

const Card = ({ data }) => {
  const { name, value, icon } = data;

  return (
    <div className={styles.cardWrapper}>
      <h4 className={styles.cardTitle}>{name}</h4>

      <div className={styles.cardBottom}>
        <h3>{value}</h3>
        <img src={icon} className={styles.icon} alt="icon" />
      </div>
    </div>
  );
};

export default Card;
