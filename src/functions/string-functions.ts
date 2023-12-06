export const maskAddress = (address: string) => {
  const masked: string = `${address.substring(0, 6)}...${address.slice(-4)}`;
  return masked;
};
