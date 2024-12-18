import React from "react";

import profile from "../../../assets/profile.png";
import styles from "./component.module.scss";

const Profile = () => {
  const dummyData = [
    {
      label: "John Smith",
      value: "Child Custody, Divorce",
    },
    {
      label: "Phone",
      value: "(316) 555-0108",
    },
    {
      label: "Email",
      value: "johnsmith@example.com",
    },
    {
      label: "Experience",
      value: "10 Years",
    },
  ];
  return (
    <div className={styles.profileWrapper}>
      <img src={profile} className={styles.profile} alt="profile" />
      {dummyData.map((el, i) => (
        <div key={i} className={styles.info}>
          <label>{el.label}</label>
          {el.value}
        </div>
      ))}
    </div>
  );
};

export default Profile;
