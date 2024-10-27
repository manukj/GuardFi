/*
 * Author : Manu Kenchappa Junjanna
 * Email : manu1998kj@gmail.com
 * Created on Fri Oct 25 2024
 */
import { FaClock, FaFlask, FaGasPump } from "react-icons/fa";

const DetailedBreakdown = () => {
  return (
    <div className="lg:col-span-2 bg-gray-200 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Detailed Breakdown</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {/* Types of Mutations Tested */}
        <div className="flex flex-col items-start justify-center">
          <div className="flex items-center mb-4">
            <div className="pr-2">
              <FaFlask size="1.2rem" color="black" />
            </div>
            <h3 className="text-lg font-medium">Types of Mutations Tested</h3>
          </div>
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
            <li>Operator Replacement</li>
            <li>Conditional Boundary Change</li>
            <li>Constant Replacement</li>
            <li>Return Value Manipulation</li>
          </ul>
        </div>

        {/* Gas Usage Analysis */}
        <div className="flex flex-col items-start justify-center">
          <div className="flex items-center mb-4">
            <div className="pr-2">
              <FaGasPump size="1.2rem" color="black" />
            </div>
            <h3 className="text-lg font-medium">Gas Usage Analysis</h3>
          </div>
          <div className="text-gray-600 text-sm space-y-2">
            <p>Average Gas: 3456</p>
            <p>Max Gas: 5678</p>
            <p>Min Gas: 1234</p>
          </div>
        </div>

        {/* Test Execution Times */}
        <div className="flex flex-col items-start justify-center">
          <div className="flex items-center mb-4">
            <div className="pr-2">
              <FaClock size="1.2rem" color="black" />
            </div>
            <h3 className="text-lg font-medium">Test Execution Times</h3>
          </div>
          <div className="text-gray-600 text-sm space-y-2">
            <p>Total Time: 35s</p>
            <p>Average Time per Test: 1.2s</p>
            <p>Max Time: 3.4s</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedBreakdown;
