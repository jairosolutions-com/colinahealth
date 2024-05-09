export const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    // Check if window object is defined (client-side)
    return localStorage.getItem("accessToken");
  }
  return null;
};

export const setAccessToken = (accessToken: string): void => {
  if (typeof window !== "undefined") {
    // Check if window object is defined (client-side)
    localStorage.setItem("accessToken", accessToken);
  }
};


export const getRememberToken = (): string | null => {
  if (typeof window !== "undefined") {
    // Check if window object is defined (client-side)
    return localStorage.getItem("accessRememberToken");
  }
  return null;
};

export const setRememberToken = (accessRememberToken: string): void => {
  if (typeof window !== "undefined") {
    // Check if window object is defined (client-side)
    localStorage.setItem("accessRememberToken", accessRememberToken);
  }
};
