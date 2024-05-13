import { useEffect, useState } from 'react';

export const useHoverEffect = () => {
  const [hoverEffect, setHoverEffect] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setHoverEffect((hoverEffect) => !hoverEffect);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  return {
    hoverEffect,
  };
};
