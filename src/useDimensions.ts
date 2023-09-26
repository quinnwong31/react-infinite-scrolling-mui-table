import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";

export const useDimensions = (excludePadding = false) => {
  const ref = useRef<HTMLDivElement>(null);
  //FIXME typing issues
  const [dimensions, setDimensions] = useState<any>({
    width: 0,
    height: 0
  });
  const handleSetDimensions = useCallback(() => {
    if (ref?.current) {
      const style = window.getComputedStyle(ref.current, null);
      const innerSize = { height: style.height, width: style.width };
      const outterSize = ref.current.getBoundingClientRect().toJSON();
      setDimensions(excludePadding ? innerSize : outterSize);
    }
  }, [excludePadding]);

  useLayoutEffect(() => {
    handleSetDimensions();
  }, [handleSetDimensions]);

  useEffect(() => {
    const listener = () => {
      handleSetDimensions();
    };
    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, [handleSetDimensions]);

  return [ref, dimensions];
};
