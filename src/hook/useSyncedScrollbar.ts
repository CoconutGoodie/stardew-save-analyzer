import { useEffect, useRef } from "react";

export function useSyncedScrollbar() {
  const refs = useRef<[HTMLElement, () => void][]>([]);

  const addScrollableRef = (element: HTMLElement | null) => {
    if (element == null) return;

    const handleScroll = () => {
      refs.current.forEach(([other]) => {
        if (other === element) return;
        other.scrollTop = element.scrollTop;
      });
    };

    element.addEventListener("scroll", handleScroll);

    refs.current.push([element, handleScroll]);
  };

  const scrollAllTo = (to: number) => {
    refs.current.forEach(([element]) => {
      element.scrollTop = to;
    });
  };

  useEffect(() => {
    return () => {
      // TODO: Y u no work?
      // refs.current?.forEach(([element, handler]) => {
      //   element.removeEventListener("scroll", handler);
      // });
    };
  }, []);

  return {
    addScrollableRef,
    scrollAllTo,
  };
}
