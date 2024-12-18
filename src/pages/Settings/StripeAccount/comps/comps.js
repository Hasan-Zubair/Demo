import React, { useEffect, useState } from "react";
import InputMask from "react-input-mask";

export function ZipCodeInput(props) {
  return (
    <InputMask
      {...props}
      mask={props.value.length >= 8 ? "**** ***" : "*** ****"}
      maskChar=""
    />
  );
}

export function SSNInput(props) {
  return <InputMask {...props} mask={"9999"} maskChar="" />;
}
