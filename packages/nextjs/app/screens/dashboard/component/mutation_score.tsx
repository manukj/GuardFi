import { FaChartPie } from "react-icons/fa";

interface MutationScoreProps {
  score: number;
}

const MutationScore = ({ score }: MutationScoreProps) => {
  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
      <FaChartPie size="2rem" color="black" />
      <h2 className="text-xl font-semibold mb-2">Overall Mutation Score</h2>
      <p className="text-6xl font-bold text-black">{score}%</p>
      <p className="text-gray-600 mt-2">Mutation Coverage of Code</p>
    </div>
  );
};

export default MutationScore;
