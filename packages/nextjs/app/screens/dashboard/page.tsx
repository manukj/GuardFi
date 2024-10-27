"use client";

import React, { useEffect, useState } from "react";
import analyzeContract from "./api/analyzeContract";
import SecurityAnalysis from "./component/security_analysis";
import CommonLoader from "~~/components/CommonLoader";

const Dashboard = () => {
  const [contractContent, setContractContent] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const storedContractContent = localStorage.getItem("contractContent");
    if (storedContractContent) {
      setContractContent(storedContractContent);
      localStorage.removeItem("contractContent");
    }
  }, []);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (contractContent) {
        setIsLoading(true); // Start loading
        try {
          const analysisResult = await analyzeContract(contractContent);
          setResponse(analysisResult);
          // setMutationScore(85); // Set the mutation score (replace with a dynamic calculation if available)
        } catch (error) {
          console.error("Error analyzing contract:", error);
        } finally {
          setIsLoading(false); // End loading
        }
      }
    };

    fetchAnalysis();
  }, [contractContent]);

  return (
    <div className="h-screen bg-white text-black flex flex-col items-center">
      {isLoading ? (
        <CommonLoader loadingText="Analyzing your contract" />
      ) : (
        <>
          {/* {<div className="absolute bottom-0 left-0 bg-no-repeat h-96 w-96">
            <Image alt="SE2 logo" className="cursor-pointer" fill src={analysisImage} />
          </div>} */}

          {response ? (
            <>
              <div>
                <h1 className="text-3xl font-bold mt-6 text-center ">Bridge Security Dashboard</h1>
              </div>
              <div className="flex-1  w-full">
                <SecurityAnalysis vulnerabilities={response} />
              </div>
              <button className="bg-black w-full py-4 text-white my-10">Deploy Contract</button>

              {/* <SecurityAnalysis vulnerabilities={response} /> */}

              {/* Detailed Breakdown */}
              {/* {response && <DetailedBreakdown />} */}

              {/* Surviving Mutations */}
              {/* {response && <SurvivingMutations />} */}
            </>
          ) : (
            <>No Content Found</>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
