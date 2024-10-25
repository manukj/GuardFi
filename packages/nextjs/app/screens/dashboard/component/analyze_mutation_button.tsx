/*
 * Author : Manu Kenchappa Junjanna
 * Email : manu1998kj@gmail.com
 * Created on Fri Oct 25 2024
 */
import React from "react";

interface AnalyzeMutationButtonProps {
  contractFile: File | null;
  testFile: File | null;
}

const AnalyzeMutationButton: React.FC<AnalyzeMutationButtonProps> = ({ contractFile, testFile }) => {
  return (
    <button
      className={`mt-6 w-full py-2 rounded ${
        contractFile && testFile ? "bg-black text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"
      }`}
      disabled={!contractFile || !testFile}
    >
      Analyze Mutation Testing
    </button>
  );
};

export default AnalyzeMutationButton;
