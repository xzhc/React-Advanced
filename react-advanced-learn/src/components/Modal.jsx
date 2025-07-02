import React from "react";
import ReactDOM from "react-dom";
export function Modal({ children, onClose }) {
  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
