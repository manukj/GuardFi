"use client";

import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  title: string;
  onCodeChange?: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ title, onCodeChange }) => {
  const [code, setCode] = useState<string>(`// Type your Solidity code here\n`);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
      if (onCodeChange) onCodeChange(value); // Call onCodeChange if provided
      checkSoliditySyntax(value);
    }
  };

  const checkSoliditySyntax = (code: string) => {
    try {
      const input = {
        language: "Solidity",
        sources: {
          "contract.sol": { content: code },
        },
        settings: {
          outputSelection: {
            "*": {
              "*": ["*"],
            },
          },
        },
      };

      const output = JSON.parse(JSON.stringify(input));

      if (output.errors) {
        const errorMessages = output.errors.map((err: any) => err.formattedMessage).join("\n");
        setError(errorMessages);
      } else {
        setError(null);
      }
    } catch (e) {
      setError("Error compiling contract");
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

      <Editor
        height="50vh"
        defaultLanguage="sol"
        defaultValue={code}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
        }}
      />

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          <strong>Error:</strong>
          <pre className="whitespace-pre-wrap">{error}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
