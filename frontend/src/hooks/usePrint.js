import { useReactToPrint } from "react-to-print";

/**
 * Simple hook for printing component
 */
function usePrint(ref) {
  // Ultra-simple implementation - just pass the ref directly
  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  return handlePrint;
}

export default usePrint; 