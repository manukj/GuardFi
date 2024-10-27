// app/api/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

interface AnalysisResult {
  overall_score: number;
  complexity: {
    score: number;
    details: string[];
    risk_level: string;
  };
  vulnerabilities: {
    score: number;
    details: string[];
    risk_level: string;
  };
}

const defaultResponse: AnalysisResult = {
  overall_score: 50,
  complexity: {
    score: 50,
    details: ["Analysis failed"],
    risk_level: "Medium",
  },
  vulnerabilities: {
    score: 50,
    details: ["Analysis failed"],
    risk_level: "Medium",
  },
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const contractCode = data.code;

    // Save contract code to temp file
    const tempFile = path.join(process.cwd(), "temp_contract.sol");
    fs.writeFileSync(tempFile, contractCode);

    // Run Python analyzer
    const result = await new Promise<AnalysisResult>(resolve => {
      const pythonProcess = spawn("python", [path.join(process.cwd(), "ai", "security_analyzer.py"), tempFile]);

      let stdoutData = "";
      let stderrData = "";

      pythonProcess.stdout.on("data", data => {
        stdoutData += data.toString();
      });

      pythonProcess.stderr.on("data", (data: Buffer) => {
        stderrData += data.toString();
        console.error("Python stderr:", data.toString());
      });

      pythonProcess.on("close", code => {
        // Clean up temp file
        try {
          fs.unlinkSync(tempFile);
        } catch (error: any) {
          console.error("Error cleaning up temp file:", error.message);
        }

        if (code !== 0) {
          console.error("Process exited with code:", code);
          console.error("Stderr:", stderrData);
          resolve({
            ...defaultResponse,
            vulnerabilities: {
              ...defaultResponse.vulnerabilities,
              details: [`Analysis failed: ${stderrData}`],
            },
          });
          return;
        }

        try {
          // Find the JSON object in the output
          const jsonMatch = stdoutData.match(/\{.*\}/s);
          if (!jsonMatch) {
            console.error("No JSON found in output:", stdoutData);
            resolve(defaultResponse);
            return;
          }

          const parsedResult = JSON.parse(jsonMatch[0]) as AnalysisResult;
          resolve(parsedResult);
        } catch (error: any) {
          console.error("Parse error:", error);
          console.error("Raw output:", stdoutData);
          resolve({
            ...defaultResponse,
            vulnerabilities: {
              ...defaultResponse.vulnerabilities,
              details: [`Parse error: ${error.message}`],
            },
          });
        }
      });
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unknown error",
        data: defaultResponse,
      },
      { status: 500 },
    );
  }
}
