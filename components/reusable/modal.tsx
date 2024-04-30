// Modal.js
import { useState } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isModalOpen: (isOpen: boolean) => void;
  content: React.ReactNode;
}

const Modal = ({ isModalOpen, content }: ModalProps) => {
  return (
    <div className="fixed z-[9999] inset-[-100px] bg-[#76898A99] flex items-center justify-center ">
      <div className="bg-[#FFFFFF] rounded-md">{content}</div>
    </div>
  );
};

export default Modal;
