"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CodeInput from "./componenets/code_input";
// import { useRouter } from "next/navigation";
import ConnectWallet from "./componenets/connect_wallet";
import Lottie from "lottie-react";
import { useAccount } from "wagmi";
import codeImage from "~~/assets/code-image.png";
import loadingAnimation from "~~/assets/security-animation.json";
import CommonLoader from "~~/components/CommonLoader";

const LoginScreen = () => {
  // const router = useRouter();
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
    <div className="h-screen w-screen flex justify-center items-center relative">
      {address ? (
        <div className="flex flex-col">
          <Image src={codeImage} alt="" className="h-96 w-96"></Image>
          <CodeInput></CodeInput>
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
