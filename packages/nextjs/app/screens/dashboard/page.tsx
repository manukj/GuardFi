"use client";

import React, { useEffect, useState } from "react";
import analyzeContract from "../api/analyzeContract";
import SecurityAnalysis from "./component/security_analysis";
import { AlertTriangle } from "lucide-react";
import CommonLoader from "~~/components/CommonLoader";

// Define the complete type structure
interface SecurityMetric {
  score: number;
  details: string[];
  risk_level: string;
}

interface SecurityAnalysisResponse {
  overall_score: number;
  complexity: SecurityMetric;
  vulnerabilities: SecurityMetric;
  upgradability: SecurityMetric;
  behavior: SecurityMetric;
}

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
          const result = await analyzeContract(contractContent);
          setResponse(result);
        } catch (err) {
          console.error("Error analyzing contract:", err);
          setError(err instanceof Error ? err.message : "Failed to analyze contract. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAnalysis();
  }, [contractContent]);

  const calculateRiskLevel = (score: number): string => {
    if (score >= 80) return "Safe to deploy";
    if (score >= 60) return "Deploy with caution";
    return "High risk - Review recommended";
  };

  const getDeployButtonClass = (score: number): string => {
    if (score >= 80) return "bg-green-500 hover:bg-green-600";
    if (score >= 60) return "bg-yellow-500 hover:bg-yellow-600";
    return "bg-red-500 hover:bg-red-600";
  };

  const calculateInsurancePremium = (analysisResult: SecurityAnalysisResponse): number => {
    const baseRate = 1000; // Base premium in USD

    // Calculate risk factors
    const complexityFactor = (100 - analysisResult.complexity.score) / 100;
    const vulnerabilityFactor = (100 - analysisResult.vulnerabilities.score) / 100;
    const upgradabilityFactor = (100 - analysisResult.upgradability.score) / 100;
    const behaviorFactor = (100 - analysisResult.behavior.score) / 100;

    // Weight the factors
    const riskScore =
      complexityFactor * 0.2 + vulnerabilityFactor * 0.4 + upgradabilityFactor * 0.2 + behaviorFactor * 0.2;

    // Calculate final premium
    const premium = baseRate * (1 + riskScore * 2); // Can double the base rate for highest risk

    return Math.round(premium);
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
                <div className="max-w-7xl mx-auto space-y-4">
                  {/* Insurance Cost Display */}
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h3 className="text-lg font-semibold text-blue-800">Recommended Insurance</h3>
                    <p className="text-blue-600">Estimated monthly premium: ${calculateInsurancePremium(response)}</p>
                    <p className="text-sm text-blue-500 mt-1">Premium based on comprehensive risk analysis</p>
                  </div>

                  <button
                    onClick={() => console.log("Deploy contract")}
                    className={`w-full py-4 text-white rounded-lg transition-colors ${getDeployButtonClass(
                      response.overall_score,
                    )}`}
                  >
                    Deploy Contract ({calculateRiskLevel(response.overall_score)})
                  </button>

                  {response.overall_score < 80 && (
                    <p className="text-center text-sm text-gray-600">
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
