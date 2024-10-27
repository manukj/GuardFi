export const mockAnalysis = {
  overall_score: 75,
  gas_score: 82,
  code_quality: 88,
  vulnerabilities: [
    {
      function: "withdraw()",
      risk: 5,
      description: "Potential reentrancy vulnerability in withdrawal function",
      recommendation: "Implement checks-effects-interactions pattern and use ReentrancyGuard",
    },
    {
      function: "transferOwnership()",
      risk: 4,
      description: "No two-step ownership transfer process",
      recommendation: "Implement two-step ownership transfer to prevent accidental transfers",
    },
  ],
};

export default async function analyzeContract(contractCode: string) {
  try {
    // Call your Python analysis endpoint
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
    // Return mock data during development
    return mockAnalysis;
  }
}
