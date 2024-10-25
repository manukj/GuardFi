import { FaBug } from "react-icons/fa";

const SurvivingMutations = () => {
  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md lg:col-span-2 flex flex-col items-start justify-center">
      <div className="flex items-center mb-4">
        <div className="pr-2">
          <FaBug size="1.5rem" color="black" />
        </div>
        <h2 className="text-xl font-semibold">Surviving Mutations</h2>
      </div>
      <p className="text-gray-600 text-sm mb-4">
        Surviving mutations indicate code areas that weren’t affected by mutation testing and may need additional test
        coverage.
      </p>
      <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
        <li>Jibberish mutation in function `calculateInterest`.</li>
        <li>Jibberish mutation in condition `user.isActive` survived.</li>
        <li>Another jibberish constant mutation not caught by tests.</li>
      </ul>
    </div>
  );
};

export default SurvivingMutations;
