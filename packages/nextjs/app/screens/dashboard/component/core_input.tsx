/*
 * Author : Manu Kenchappa Junjanna
 * Email : manu1998kj@gmail.com
 * Created on Fri Oct 25 2024
 */
import React, { useState } from "react";
import Image from "next/image";
import AnalyzeMutationButton from "./analyze_mutation_button";
import FileUploadCard from "./file_upload_card";
import PickFileBottomSheet from "./pick_file_bottomsheet";
import WriteCodeBottomSheet from "./write_code_bottom_sheet";
import { FaPaste, FaUpload } from "react-icons/fa";
import brainImage from "~~/assets/brain-analysis.png";

const CodeInput: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState<"filePicker" | "codeEditor" | null>(null); // Manage modal type
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [testFile, setTestFile] = useState<File | null>(null);

  // Handle contract file change
  const handleContractFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setContractFile(e.target.files[0]);
  };

  // Handle test file change
  const handleTestFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setTestFile(e.target.files[0]);
  };

  // Reset contract file
  const resetContractFile = () => {
    setContractFile(null);
  };

  // Reset test file
  const resetTestFile = () => {
    setTestFile(null);
  };

  // Function to handle "Upload Code" click
  const handleUploadCodeClick = () => {
    setModalOpen("filePicker");
  };

  // Function to handle "Add Code" click
  const handleAddCodeClick = () => {
    setModalOpen("codeEditor");
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(null);
  };

  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
      <h2 className="text-xl font-semibold mb-4">Code Input</h2>
      <div className="flex space-x-4">
        {/* Upload Code Button */}
        <button
          className="flex w-44 place-content-center items-center space-x-2 p-2 bg-black text-white rounded"
          onClick={handleUploadCodeClick} // Set the modal to show file picker
        >
          <FaUpload size="1rem" color="white" />
          <span>Upload Code</span>
        </button>

        {/* Add Code Button */}
        <button
          className="flex w-44 place-content-center items-center space-x-2 p-2 bg-black text-white rounded"
          onClick={handleAddCodeClick} // Set the modal to show code editor
        >
          <FaPaste size="1rem" color="white" />
          <span>Add Code</span>
        </button>
      </div>

      {/* Bottom Sheet Modal */}
      {isModalOpen && (
        <PickFileBottomSheet
          isOpen={isModalOpen !== null}
          toggleModal={closeModal}
          title={isModalOpen === "filePicker" ? "Upload Files" : "Write Code"}
          width={isModalOpen === "filePicker" ? "max-w-2xl" : "max-w-6xl"}
        >
          {isModalOpen === "filePicker" ? (
            <div className="flex flex-col place-content-center items-center">
              <Image alt="Brain Analysis" className="h-80 w-80" src={brainImage} />
              <div className="flex flex-col lg:flex-row justify-between items-center mb-4 space-y-4 lg:space-y-0 lg:space-x-4">
                {/* Contract File Upload Card */}
                <FileUploadCard
                  label="Upload Contract"
                  file={contractFile}
                  onFileChange={handleContractFileChange}
                  onCancel={resetContractFile}
                  icon="contract"
                />

                {/* Test File Upload Card */}
                <FileUploadCard
                  label="Upload Test"
                  file={testFile}
                  onFileChange={handleTestFileChange}
                  onCancel={resetTestFile}
                  icon="test"
                />
              </div>

              {/* Analyze Mutation Button */}
              <AnalyzeMutationButton contractFile={contractFile} testFile={testFile} />
            </div>
          ) : (
            <WriteCodeBottomSheet /> // Render WriteCodeBottomSheet for code editor
          )}
        </PickFileBottomSheet>
      )}
    </div>
  );
};

export default CodeInput;
