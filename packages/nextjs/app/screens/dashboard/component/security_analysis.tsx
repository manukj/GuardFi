// app/screens/dashboard/component/security_analysis.tsx
import React from "react";
import { AlertTriangle, Code, Coins, Shield } from "lucide-react";

type SecurityMetric = {
  score: number;
  details: string[];
  risk_level: "Low" | "Medium" | "High";
};

type SecurityAnalysisResult = {
  complexity: SecurityMetric;
  vulnerabilities: SecurityMetric;
  financial_exposure: SecurityMetric;
  upgradability: SecurityMetric;
  behavior: SecurityMetric;
  code_quality: SecurityMetric;
  historical_performance: SecurityMetric;
  overall_score: number;
};

type InsuranceQuote = {
  monthly_premium: number;
  coverage_amount: number;
  deductible: number;
};

const SecurityAnalysis = ({ analysis }: { analysis: SecurityAnalysisResult }) => {
  const calculateInsuranceQuote = (score: number): InsuranceQuote => {
    // Base premium calculation based on security score
    const basePremium = 1000 * (1 + (100 - score) / 100);
    const coverage = 1000000 * (score / 100); // Higher coverage for safer contracts
    const deductible = 10000 * ((100 - score) / 100); // Lower deductible for safer contracts

    return {
      monthly_premium: Math.round(basePremium),
      coverage_amount: Math.round(coverage),
      deductible: Math.round(deductible),
    };
  };

  const insuranceQuote = calculateInsuranceQuote(analysis.overall_score);

  return (
    <div className="space-y-8 p-6">
      {/* Overall Score */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Shield className="mr-2 text-blue-500" />
          Overall Security Score: {analysis.overall_score}/100
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full ${
              analysis.overall_score > 80
                ? "bg-green-500"
                : analysis.overall_score > 60
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${analysis.overall_score}%` }}
          />
        </div>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Contract Complexity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold flex items-center">
            <Code className="mr-2 text-purple-500" />
            Contract Complexity
          </h3>
          <div className="mt-2">
            <div className="text-3xl font-bold text-purple-500 mb-2">{analysis.complexity.score}/100</div>
            <ul className="list-disc list-inside text-sm">
              {analysis.complexity.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Vulnerabilities */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold flex items-center">
            <AlertTriangle className="mr-2 text-red-500" />
            Security Vulnerabilities
          </h3>
          <div className="mt-2">
            <div className="text-3xl font-bold text-red-500 mb-2">{analysis.vulnerabilities.score}/100</div>
            <ul className="list-disc list-inside text-sm">
              {analysis.vulnerabilities.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Add other metric cards similarly */}
      </div>

      {/* Insurance Quote Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Coins className="mr-2 text-green-500" />
          Smart Contract Insurance Quote
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-gray-600">Monthly Premium</p>
            <p className="text-3xl font-bold text-green-500">${insuranceQuote.monthly_premium}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Coverage Amount</p>
            <p className="text-3xl font-bold text-blue-500">${insuranceQuote.coverage_amount.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Deductible</p>
            <p className="text-3xl font-bold text-purple-500">${insuranceQuote.deductible.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors">
            Purchase Insurance
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityAnalysis;
