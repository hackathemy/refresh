import { useEffect, useState } from "react";

const useAccount = async () => {
  const [account, setAccount] = useState<string>('');

  try {
    if (!window.ethereum) throw new Error("Error : no metamask");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts && Array.isArray(accounts)) {
      setAccount(accounts[0]);
    }
  } catch (e) {
    console.log(e);
  }

  return { account };
};

export default useAccount;