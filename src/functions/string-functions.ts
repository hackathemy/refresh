export const maskAddress = (address: string | undefined) => {
  if (address && address.length > 6) {
    return `${address.substring(0, 6)}...${address.slice(-4)}`;
  } else {
    return address;
  }
};
