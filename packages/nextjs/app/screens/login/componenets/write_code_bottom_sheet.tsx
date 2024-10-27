"use client";

import React, { useState } from "react";
import AnalyzeMutationButton from "../../dashboard/component/analyze_mutation_button";
import CodeEditor from "../../dashboard/component/code_editor";

const WriteCodeBottomSheet: React.FC = () => {
  const [contractCode, setContractCode] = useState<File | null>(null);
  // const [testCode, setTestCode] = useState<File | null>(null);

  const handleContractCodeChange = (code: string) => {
    setContractCode(code ? new File([code], "Contract.sol") : null);
  };

  return (
    <div className="w-full ">
      <div className="container mx-auto space-y-8">
        <div className="flex flex-row">
          {/* Contract Code Editor */}
          <div className="bg-white shadow-md rounded-lg p-6 w-full">
            <CodeEditor onCodeChange={handleContractCodeChange} />
          </div>

          {/* Test Code Editor */}
          {/* <div className="bg-white shadow-md rounded-lg p-6">
            <CodeEditor title="Test Code" onCodeChange={handleTestCodeChange} />
          </div> */}
        </div>

        {/* Analyze Mutation Button */}
        <div className="flex justify-center mt-6">
          <AnalyzeMutationButton contractFile={contractCode} />
        </div>
      </div>
    </div>
  );
};

export default WriteCodeBottomSheet;
