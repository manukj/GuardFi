/*
 * Author : Manu Kenchappa Junjanna
 * Email : manu1998kj@gmail.com
 * Created on Fri Oct 25 2024
 */
import React from "react";
import { FaFileAlt, FaFileContract } from "react-icons/fa";

interface FileUploadCardProps {
  label: string;
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  icon: "contract" | "test";
}

const FileUploadCard: React.FC<FileUploadCardProps> = ({ label, file, onFileChange, onCancel, icon }) => {
  return (
    <div className="card w-full lg:w-60 bg-base-100 border  p-4 flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-2">
        {icon === "contract" ? <FaFileContract size="1.5rem" /> : <FaFileAlt size="1.5rem" />}
        <span className="font-semibold">{label}</span>
      </div>

      {!file ? (
        <div className="w-full">
          <input
            type="file"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            onChange={onFileChange}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          {/* Truncate long filenames */}
          <span className="text-sm text-gray-600 mb-2 truncate w-full">{file.name}</span>
          <button className="btn btn-sm btn-error" onClick={onCancel}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploadCard;
