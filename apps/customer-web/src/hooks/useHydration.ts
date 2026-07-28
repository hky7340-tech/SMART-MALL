import { useState, useEffect } from 'react';

/**
 * Hook that returns true after component mounts on client side.
 * Used to suppress hydration mismatches for dynamic content.
 */
export function useHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
