/*
 * Author : Manu Kenchappa Junjanna
 * Email : manu1998kj@gmail.com
 * Created on Fri Oct 25 2024
 */
import React from "react";
import { useRouter } from "next/navigation";

interface AnalyzeMutationButtonProps {
  contractFile: File | null;
  testFile?: File | null;
}

const AnalyzeMutationButton: React.FC<AnalyzeMutationButtonProps> = ({ contractFile, testFile }) => {
  const router = useRouter();

  const handleClick = async () => {
    if (contractFile) {
      try {
        // Read the content of the contract file
        const contractContent = await contractFile.text();
        const testContent = testFile ? await testFile.text() : "";

        // Store the content in localStorage (you can use a more secure method)
        localStorage.setItem("contractContent", contractContent);
        if (testContent) {
          localStorage.setItem("testContent", testContent);
        }

        // Redirect to the analyze page
        router.push("screens/dashboard");
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`m-0 p-0 w-full py-2 rounded ${
        contractFile ? "bg-black text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"
      }`}
      disabled={!contractFile}
    >
      Analyze Code
    </button>
  );
};

export default AnalyzeMutationButton;
