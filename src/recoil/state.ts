import { atom } from "recoil";

export interface IContentTypes {
    address: string;
    status: boolean;
}

export const walletState = atom<string>({
    key: "#walletState",
    default: '',
  });