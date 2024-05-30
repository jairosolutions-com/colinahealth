import { useState, useEffect, useRef } from 'react';

const useIsTruncated = (text: string) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, [text]);

  return [isTruncated, textRef] as const;
};

export default useIsTruncated;
