import React, { forwardRef } from "react";
import Checkbox from "@mui/material/Checkbox";
import { ReactComponent as Checked } from "../../assets/icons/checkbox/checkbox-checked.svg";
import { ReactComponent as UnChecked } from "../../assets/icons/checkbox/checkbox-unchecked.svg";
import { ReactComponent as Indeterminate } from "../../assets/icons/checkbox/checkbox-indeterminate.svg";

const CheckBox = forwardRef((props, ref) => {
  return (
    <Checkbox
      icon={<UnChecked />}
      indeterminateIcon={<Indeterminate />}
      checkedIcon={<Checked />}
      ref={ref}
      {...props}
    />
  );
});

CheckBox.displayName = "CheckBox";

export default CheckBox;
