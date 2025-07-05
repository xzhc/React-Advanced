import { forwardRef } from "react";

export const CustomInput = forwardRef((props, ref) => {
  return (
    <div className="custom-input-container">
      <label htmlFor={props.id}>{props.label}</label>
      <input
        type={props.type || "text"}
        id={props.id}
        ref={ref}
        className="custom-input"
        placeholder={props.placeholder}
        {...props}
      />
    </div>
  );
});
