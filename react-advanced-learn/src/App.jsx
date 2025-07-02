import { useState } from "react";
import { Modal } from "./components/Modal";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <>
      <h1>React Modal Example</h1>
      <button onClick={openModal}>Open Modal</button>
      {isOpen && <Modal onClose={closeModal}>This is a modal</Modal>}
    </>
  );
}

export default App;
