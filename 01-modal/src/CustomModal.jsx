import { useEffect } from "react";
import { createPortal } from "react-dom";

export function CustomModal({ isOpen, children, onClose }) {
  useEffect(() => {
    function handler(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [onClose]);
  return createPortal(
    <div className={`modal-overlay ${isOpen && "show"}`}>
      <div className="modal">{children}</div>
    </div>,
    document.getElementById("modal-container")
  );
}
