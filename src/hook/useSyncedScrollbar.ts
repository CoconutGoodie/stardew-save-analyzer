import { useEffect, useState } from "react";

export function useSyncedScrollbar() {
  const [elements] = useState<Map<HTMLElement, () => void>>(() => new Map());

  const addScrollableRef = (element: HTMLElement | null) => {
    if (element == null) return;
    if (elements.has(element)) return;

    const handleScroll = () => {
      elements.forEach((_, other) => {
        if (other === element) return;
        if (other.scrollTop != element.scrollTop) {
          other.scrollTop = element.scrollTop;
        }
      });
    };

    element.addEventListener("scroll", handleScroll);

    elements.set(element, handleScroll);
  };

  const scrollAllTo = (to: number) => {
    elements.forEach((_, element) => {
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
