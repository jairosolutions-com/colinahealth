export const getResetPassToken = (): string | null => {
    if (typeof window !== "undefined") {
      // Check if window object is defined (client-side)
      return localStorage.getItem("resetToken");
    }
    return null;
  };
  
  export const setResetPassToken = (resetToken: string): void => {
    if (typeof window !== "undefined") {
      // Check if window object is defined (client-side)
      localStorage.setItem("resetToken", resetToken);
    }
  };
  