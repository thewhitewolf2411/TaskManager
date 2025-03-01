import { useState, useEffect } from "react";

export default function useMedia(
  queries: string[], 
  values: number[], 
  defaultValue: number
): number {
  // Create a list of media query objects
  const mediaQueryLists = queries.map((q) => window.matchMedia(q));

  // Function to get the value based on matching media query
  const getValue = () => {
    const index = mediaQueryLists.findIndex((mql) => mql.matches);
    return index !== -1 ? values[index] : defaultValue;
  };

  // State to store the active value
  const [value, setValue] = useState<number>(getValue);

  useEffect(() => {
    // Listener callback to update the state on media change
    const handler = () => setValue(getValue);
    
    // Attach listener to each media query
    mediaQueryLists.forEach((mql) => mql.addEventListener("change", handler));

    return () => {
      // Cleanup: Remove listeners on unmount
      mediaQueryLists.forEach((mql) => mql.removeEventListener("change", handler));
    };
  }, []); // Only runs once on mount

  return value;
}
