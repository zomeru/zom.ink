import { useEffect, useState } from "react";

export const useError = () => {
  const [error, setError] = useState<string | null | undefined>();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (error) setError(null);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  return [error, setError] as const;
};
