// src/hooks/useWindowSize.js
import { useState, useEffect } from 'react';

const useWindowSize = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const handleResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    console.log('EVENT LISTENER ADDED');
    return () => {
      window.removeEventListener('resize', handleResize);
      console.log('EVENT LISTENER REMOVED');
    };
  }, []);

  return { width, height };
};

export default useWindowSize;
