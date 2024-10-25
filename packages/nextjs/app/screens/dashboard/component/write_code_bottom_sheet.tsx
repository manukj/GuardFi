"use client";

import React, { useState } from "react";
import AnalyzeMutationButton from "./analyze_mutation_button";
import CodeEditor from "./code_editor";

const WriteCodeBottomSheet: React.FC = () => {
  const [contractCode, setContractCode] = useState<File | null>(null);
  const [testCode, setTestCode] = useState<File | null>(null);

  const handleContractCodeChange = (code: string) => {
    setContractCode(code ? new File([code], "Contract.sol") : null);
  };

  const handleTestCodeChange = (code: string) => {
    setTestCode(code ? new File([code], "TestContract.sol") : null);
  };

  return (
    <div className="w-full ">
      <div className="container mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contract Code Editor */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <CodeEditor title="Contract Code" onCodeChange={handleContractCodeChange} />
          </div>

          {/* Test Code Editor */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <CodeEditor title="Test Code" onCodeChange={handleTestCodeChange} />
          </div>
        </div>

        {/* Analyze Mutation Button */}
        <div className="flex justify-center mt-6">
          <AnalyzeMutationButton contractFile={contractCode} testFile={testCode} />
        </div>
      </div>
    </div>
  );
};

export default WriteCodeBottomSheet;
