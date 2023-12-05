import { atom } from "recoil";
import Web3 from "web3";

export interface IContentTypes {
    address: string;
    status: boolean;
    web3: any;
    account: string;
}

export const walletState = atom<IContentTypes>({
    key: "#walletState",
    default: {
        address : 'address',
        status: false,
        web3: null,
        account: 'account'
    },
  });