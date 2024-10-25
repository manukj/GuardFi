/*
 * Author : Manu Kenchappa Junjanna
 * Email : manu1998kj@gmail.com
 * Created on Fri Oct 25 2024
 */

/*
 * Author : Manu Kenchappa Junjanna
 * Email : manu1998kj@gmail.com
 * Created on Fri Oct 25 2024
 */
import React, { ReactNode } from "react";
import { FaTimes } from "react-icons/fa";

// Import the "X" icon

interface PickFileBottomSheetProps {
  isOpen: boolean;
  toggleModal: () => void;
  children: ReactNode;
  title: string;
  width?: string;
}

const PickFileBottomSheet: React.FC<PickFileBottomSheetProps> = ({ isOpen, toggleModal, children, title, width }) => {
  return (
    <>
      {/* Modal Toggle */}
      <input type="checkbox" id="my-modal" className="modal-toggle" checked={isOpen} onChange={toggleModal} />

      {/* Modal Box */}
      <div className={`modal`}>
        {" "}
        {/* Ensure it slides from bottom */}
        <div className={`modal-box w-11/12 ${width}`}>
          {/* "X" button in the top-right corner */}
          <button onClick={toggleModal} className="absolute top-3 right-3 text-gray-600 hover:text-black">
            <FaTimes size="1.5rem" />
          </button>

          <h3 className="text-3xl font-bold mb-4">{title}</h3>

          {/* Children Content */}
          {children}
        </div>
      </div>
    </>
  );
};

export default PickFileBottomSheet;
