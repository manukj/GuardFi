"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ConnectWallet from "./componenets/connect_wallet";
import Lottie from "lottie-react";
import { useAccount } from "wagmi";
import loadingAnimation from "~~/assets/security-animation.json";
import CommonLoader from "~~/components/CommonLoader";

const LoginScreen = () => {
  const router = useRouter();
  const { address, isConnecting } = useAccount();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isConnecting) {
      setIsLoading(false);
    }
  }, [isConnecting]);

  // Redirect to dashboard if address is present
  useEffect(() => {
    if (address) {
      router.push("/screens/dashboard");
    }
  }, [address, router]);

  if (isLoading) {
    return <CommonLoader />;
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center relative">
      <Lottie animationData={loadingAnimation} loop={true} className="absolute inset-0 w-full" />
      <div className="absolute">
        <ConnectWallet />
      </div>
    </div>
  );
};

export default LoginScreen;
