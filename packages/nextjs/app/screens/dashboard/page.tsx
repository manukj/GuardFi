"use client";

import React, { useState } from "react";
import Image from "next/image";
import CodeInput from "./component/core_input";
import DetailedBreakdown from "./component/detailed_breakdown";
import MutationScore from "./component/mutation_score";
import SurvivingMutations from "./component/surviving_mutations";
import analysisImage from "~~/assets/analysis-image.png";

const Dashboard = () => {
  const [mutationScore] = useState(85); // Example mutation score

  return (
    <div className="min-h-screen bg-white text-black p-8 flex flex-col items-center relative">
      {/* Background Image */}
      <div className="absolute bottom-0 left-0 bg-no-repeat h-80 w-80">
        <Image alt="SE2 logo" className="cursor-pointer h-52 w-52" fill src={analysisImage} />
      </div>

      {/* Content on top of the background image */}
      <h1 className="text-3xl font-bold mb-6 text-center z-10">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-4xl z-10">
        {/* Overall Mutation Score */}
        <MutationScore score={mutationScore} />

        {/* Code Upload or Copy-Paste Section */}
        <CodeInput />

        {/* Detailed Breakdown */}
        <DetailedBreakdown />

        {/* Surviving Mutations */}
        <SurvivingMutations />
      </div>
    </div>
  );
};

export default Dashboard;
