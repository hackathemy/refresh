export const maskAddress = (address: string | undefined) => {
  if (address && address.length > 10) {
    return `${address.substring(0, 6)}...${address.slice(-4)}`;
  } else {
    return address;
  }
};
export const maskContractAddress = (address: string | undefined) => {
  if (address && address.length > 20) {
    return `${address.substring(0, 10)}...${address.slice(-10)}`;
  } else {
    return address;
  }
};

export const formatNumber = (num: number | undefined) => {
  if (typeof num === "number") {
    // 숫자인 경우 소수점 3자리까지 유지
    return num.toFixed(3);
  } else {
    // 숫자가 아닌 경우 그대로 반환
    return num;
  }
};

export const formatDate = (
  dateString: string | undefined
): string | undefined => {
  if (!dateString) {
    return undefined;
  }

  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Invalid date string:", dateString);
    return undefined;
  }
};
