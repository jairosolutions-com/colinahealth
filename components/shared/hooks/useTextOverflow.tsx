'use client'
import { useEffect, useRef, useState } from 'react';

const useTextOverflow = () => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const { current } = textRef;
    if (current) {
      const isOverflowing = current.scrollWidth > current.clientWidth;
      setIsOverflowing(isOverflowing);
    }
  }, []);

  return { isOverflowing, textRef };
};

export default useTextOverflow;
