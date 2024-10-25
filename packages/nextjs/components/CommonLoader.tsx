import React from "react";
import loadingAnimation from "./assets/loading-animation.json";
import Lottie from "lottie-react";
import { TypeAnimation } from "react-type-animation";

interface CommonLoaderProps {
  loadingText?: string; // Optional prop
}

const CommonLoader: React.FC<CommonLoaderProps> = ({ loadingText = "Loading ..." }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-screen">
      <Lottie animationData={loadingAnimation} loop={true} />

      <TypeAnimation
        sequence={[
          loadingText, // Types 'One'
          1000,
          "Please Wait ....", // Deletes 'One' and types 'Two'
          2000,
          () => {
            console.log("Sequence completed");
          },
        ]}
        wrapper="span"
        cursor={true}
        repeat={Infinity}
        style={{ fontSize: "2em", display: "inline-block" }}
      />
    </div>
  );
};

export default CommonLoader;
