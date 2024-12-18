import React from "react";
import InputMask from "react-input-mask";

export default function PhoneInput(props) {
  return (
    <InputMask
      aria-label="E.g 1213457895"
      {...props}
      mask="9999999999"
      maskChar=""
    />
  );
}
