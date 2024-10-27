import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

const ConnectWallet = () => {
  return (
    <div className="flex flex-col place-content-center place-items-center place-self-center ">
      {/* <img src="/wallet_connect.gif" className="justify-center" style={{ width: "100px", height: "100px" }} /> */}
      <RainbowKitCustomConnectButton />
    </div>
  );
};

export default ConnectWallet;
