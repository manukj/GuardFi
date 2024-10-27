"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CodeInput from "./componenets/code_input";
import ConnectWallet from "./componenets/connect_wallet";
import Lottie from "lottie-react";
import { useAccount } from "wagmi";
import codeImage from "~~/assets/code-image.png";
import loadingAnimation from "~~/assets/security-animation.json";
import CommonLoader from "~~/components/CommonLoader";

const LoginScreen = () => {
  const { address, isConnecting } = useAccount();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isConnecting) {
      setIsLoading(false);
    }
  }, [isConnecting]);

  if (isLoading) {
    return <CommonLoader />;
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center relative">
      {/* Title of the dApp */}
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">GuardFi - Smart Contract Insurance Platform</h1>

      {address ? (
        <div className="flex flex-col items-center">
          <Image src={codeImage} alt="" className="h-96 w-96" />
          <CodeInput />
        </div>
      ) : (
        <>
          <Lottie animationData={loadingAnimation} loop={true} className="absolute inset-0 w-full" />
          <div className="absolute">
            <ConnectWallet />
          </div>
        </>
      )}
    </div>
  );
};

export default LoginScreen;
