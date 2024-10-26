import React from "react";
import { mockAnalysis } from "../api/analyzeContract";
import { Shield } from "lucide-react";

type Vulnerability = {
  function: string;
  risk: number;
  description: string;
  recommendation: string;
};

type SecurityDashboardProps = {
  vulnerabilities: Vulnerability[];
};

const SecurityAnalysis = ({ vulnerabilities }: SecurityDashboardProps) => {
  vulnerabilities = vulnerabilities ? vulnerabilities : mockAnalysis;

  // Sort vulnerabilities by risk level (high to low)
  const sortedVulnerabilities = [...vulnerabilities].sort((a, b) => b.risk - a.risk);

  const getRiskColor = (risk: number) => {
    const colors: { [key: number]: string } = {
      5: "bg-red-100 text-red-800",
      4: "bg-orange-100 text-orange-800",
      3: "bg-yellow-100 text-yellow-800",
      2: "bg-blue-100 text-blue-800",
      1: "bg-green-100 text-green-800",
    };
    return colors[risk] || "bg-gray-100";
  };

  return (
    <div className="h-full  p-8  ">
      {/* Header */}
      {/* <div className="mb-8">
                <p className="text-gray-600">Contract: 0x1234...5678</p>
            </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vulnerability Analysis Panel */}
        <div className="bg-white rounded-lg shadow p-6 col-span-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Shield className="mr-2" size={24} />
              Security Analysis
            </h2>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
              {sortedVulnerabilities.filter(vuln => vuln.risk >= 4).length} High Risk Issues
            </span>
          </div>

          {/* Vulnerability List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedVulnerabilities.map((vuln, index) => (
              <div key={index} className={`p-4 rounded-lg ${getRiskColor(vuln.risk)}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{vuln.function}</div>
                  <span className="px-2 py-1 bg-white bg-opacity-50 rounded text-sm">Risk Level: {vuln.risk}/5</span>
                </div>
                <p className="text-sm mb-2">{vuln.description}</p>
                <p className="text-sm font-medium">Recommendation: {vuln.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAnalysis;
