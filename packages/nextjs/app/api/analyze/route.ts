// app/api/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const contractCode = data.code;

    // Save contract code temporarily
    const tempFile = path.join(process.cwd(), "ai", "temp_contract.sol");
    fs.writeFileSync(tempFile, contractCode);

    // Call Python analyzer
    const result = await new Promise((resolve, reject) => {
      const pythonProcess = spawn("python", [path.join(process.cwd(), "ai", "security_analyzer.py"), tempFile]);

      let output = "";
      let errorOutput = "";

      pythonProcess.stdout.on("data", data => {
        output += data.toString();
      });

      pythonProcess.stderr.on("data", data => {
        errorOutput += data.toString();
      });

      pythonProcess.on("close", code => {
        fs.unlinkSync(tempFile); // Clean up temp file
        if (code !== 0) {
          reject(new Error(`Python process exited with code ${code}\n${errorOutput}`));
          return;
        }
        try {
          resolve(JSON.parse(output));
        } catch (e) {
          reject(new Error("Failed to parse Python output"));
        }
      });
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({ success: false, error: "Failed to analyze contract" }, { status: 500 });
  }
}
