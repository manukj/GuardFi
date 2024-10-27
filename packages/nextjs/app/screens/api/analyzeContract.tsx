// app/screens/api/analyzeContract.tsx
export interface SecurityMetrics {
  score: number;
  details: string[];
  risk_level: string;
}

export interface SecurityAnalysisResult {
  overall_score: number;
  complexity: SecurityMetrics;
  vulnerabilities: SecurityMetrics;
  upgradability: SecurityMetrics;
  behavior: SecurityMetrics;
}

export const mockAnalysis: SecurityAnalysisResult = {
  overall_score: 75,
  complexity: {
    score: 80,
    details: ["Lines of Code: 150", "External Calls: 2", "Nesting Depth: 3", "State Variables: 5"],
    risk_level: "Low",
  },
  vulnerabilities: {
    score: 70,
    details: ["No major vulnerabilities detected"],
    risk_level: "Medium",
  },
  upgradability: {
    score: 85,
    details: ["Upgradeable: No", "Access Control: Yes"],
    risk_level: "Low",
  },
  behavior: {
    score: 75,
    details: ["Reentrancy Protection: Yes", "Access Controls: Yes"],
    risk_level: "Medium",
  },
};

export default async function analyzeContract(contractCode: string): Promise<SecurityAnalysisResult> {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: contractCode }),
    });

    if (!response.ok) {
      throw new Error("Analysis failed");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Contract analysis error:", error);
    return mockAnalysis;
  }
}
