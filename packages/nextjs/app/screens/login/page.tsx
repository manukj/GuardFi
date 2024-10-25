"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ConnectWallet from "./componenets/connect_wallet";
import Lottie from "lottie-react";
import { useAccount } from "wagmi";
import loadingAnimation from "~~/assets/security-animation.json";
import CommonLoader from "~~/components/CommonLoader";

// import { useAuthContext } from "~~/contexts/AuthContext";

const LoginScreen = () => {
  const router = useRouter();
  //   const { verifiedAddress, setVerifiedAddress } = useAuthContext();
  const { address, isConnecting } = useAccount();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isConnecting) {
      setIsLoading(false);
    }
  }, [isConnecting]);

  if (isLoading) {
    return <CommonLoader></CommonLoader>;
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center relative">
      <Lottie animationData={loadingAnimation} loop={true} className="absolute inset-0 w-full " />
      {address ? (
        <div className="absolute flex flex-col items-center text-center">
          <p>Verified As Human</p>
          <div className="card-actions flex flex-col items-center space-y-2 mt-4">
            <button
              className="btn btn-primary w-30"
              onClick={() => {
                router.push("/screens/insuranceform");
              }}
            >
              Get Insured
            </button>
            <button className="btn border-black w-30">Claim</button>
          </div>
        </div>
      ) : (
        <div className="absolute">
          <ConnectWallet />
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
