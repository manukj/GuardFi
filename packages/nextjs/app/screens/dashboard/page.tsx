"use client";

import React, { useEffect, useState } from "react";
import analyzeContract from "../api/analyzeContract";
import SecurityAnalysis from "./component/security_analysis";
import { AlertTriangle } from "lucide-react";
import CommonLoader from "~~/components/CommonLoader";

// Define types for our security analysis
type SecurityAnalysisResponse = {
  overall_score: number;
  complexity: {
    score: number;
    details: string[];
    risk_level: "Low" | "Medium" | "High";
  };
  vulnerabilities: {
    score: number;
    details: string[];
    risk_level: "Low" | "Medium" | "High";
  };
  financial_exposure: {
    score: number;
    details: string[];
    risk_level: "Low" | "Medium" | "High";
  };
  upgradability: {
    score: number;
    details: string[];
    risk_level: "Low" | "Medium" | "High";
  };
  behavior: {
    score: number;
    details: string[];
    risk_level: "Low" | "Medium" | "High";
  };
  code_quality: {
    score: number;
    details: string[];
    risk_level: "Low" | "Medium" | "High";
  };
  historical_performance: {
    score: number;
    details: string[];
    risk_level: "Low" | "Medium" | "High";
  };
};

const Dashboard = () => {
  const [contractContent, setContractContent] = useState<string | null>(null);
  const [response, setResponse] = useState<SecurityAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
        setIsLoading(true);
        setError(null);

        try {
          const analysisResult = await analyzeContract(contractContent);
          setResponse(analysisResult);
        } catch (error) {
          console.error("Error analyzing contract:", error);
          setError("Failed to analyze contract. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAnalysis();
  }, [contractContent]);

  const handleDeploy = async () => {
    // Add deployment logic here
    if (response && response.overall_score < 60) {
      if (!confirm("This contract has a low security score. Are you sure you want to deploy?")) {
        return;
      }
    }
    // Implement deployment logic
    console.log("Deploying contract...");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black flex flex-col items-center">
      {isLoading ? (
        <CommonLoader loadingText="Analyzing your smart contract for security vulnerabilities..." />
      ) : (
        <>
          {error ? (
            <div className="w-full max-w-2xl mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center text-red-700">
                <AlertTriangle className="mr-2" />
                <span>{error}</span>
              </div>
            </div>
          ) : response ? (
            <>
              <div className="w-full px-4 py-6 bg-white shadow-sm">
                <h1 className="text-3xl font-bold text-center">Smart Contract Security Analysis</h1>
                <p className="text-center text-gray-600 mt-2">Comprehensive security assessment and risk analysis</p>
              </div>

              <div className="flex-1 w-full max-w-7xl px-4 py-8">
                <SecurityAnalysis analysis={response} />
              </div>

              <div className="w-full px-4 py-6 bg-white border-t">
                <div className="max-w-7xl mx-auto">
                  <button
                    onClick={handleDeploy}
                    className={`w-full py-4 text-white rounded-lg transition-colors ${
                      response.overall_score >= 80
                        ? "bg-green-500 hover:bg-green-600"
                        : response.overall_score >= 60
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {response.overall_score >= 80
                      ? "Deploy Contract (Safe)"
                      : response.overall_score >= 60
                      ? "Deploy Contract (Caution)"
                      : "Deploy Contract (High Risk)"}
                  </button>

                  {response.overall_score < 80 && (
                    <p className="text-center text-sm text-gray-600 mt-2">
                      Consider addressing security concerns before deployment
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-600">No contract found for analysis</p>
              <p className="text-sm text-gray-500 mt-2">Upload a contract to begin security analysis</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
