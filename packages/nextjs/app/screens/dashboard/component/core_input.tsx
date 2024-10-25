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
import { FaPaste, FaUpload } from "react-icons/fa";
import brainImage from "~~/assets/brain-analysis.png";

const CodeInput: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [testFile, setTestFile] = useState<File | null>(null);

  // Toggle modal visibility
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

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

  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
      <h2 className="text-xl font-semibold mb-4">Code Input</h2>
      <div className="flex space-x-4">
        {/* Upload Code Button */}
        <button className="flex items-center space-x-2 p-2 bg-black text-white rounded" onClick={toggleModal}>
          <FaUpload size="1rem" color="white" />
          <span>Upload Code</span>
        </button>

        {/* Copy-Paste Code Button */}
        <button className="flex items-center space-x-2 p-2 bg-black text-white rounded">
          <FaPaste size="1rem" color="white" />
          <span>Copy-Paste Code</span>
        </button>
      </div>

      {/* Pick File Bottom Sheet Modal */}
      <PickFileBottomSheet isOpen={isModalOpen} toggleModal={toggleModal}>
        <div className="flex flex-col place-content-center items-center">
          <Image alt="SE2 logo" className="h-80 w-80" src={brainImage} />
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
      </PickFileBottomSheet>
    </div>
  );
};

export default CodeInput;
