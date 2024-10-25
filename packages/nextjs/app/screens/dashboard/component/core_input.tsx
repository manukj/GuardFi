import { FaPaste, FaUpload } from "react-icons/fa";

const CodeInput = () => {
  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
      <h2 className="text-xl font-semibold mb-4">Code Input</h2>
      <div className="flex space-x-4">
        <button className="flex items-center space-x-2 p-2 bg-black text-white rounded">
          <FaUpload size="1rem" color="white" />
          <span>Upload Code</span>
        </button>
        <button className="flex items-center space-x-2 p-2 bg-black text-white rounded">
          <FaPaste size="1rem" color="white" />
          <span>Copy-Paste Code</span>
        </button>
      </div>
    </div>
  );
};

export default CodeInput;
