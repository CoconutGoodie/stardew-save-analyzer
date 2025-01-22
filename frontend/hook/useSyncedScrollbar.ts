import { DependencyList, useEffect, useRef, useState } from "react";

// let scrollingElement: HTMLElement;
// let isSyncing = false;

export function useSyncedScrollbar(resetDeps?: DependencyList) {
  const [elements] = useState<Map<HTMLElement, () => void>>(() => new Map());

  const registerScrollableRef = (element: HTMLElement | null) => {
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

  useEffect(() => {
    elements.forEach((_, element) => {
      element.scrollTop = 0;
    });
  }, resetDeps);

  useEffect(() => {
    return () => {
      // TODO: Y u no work?
      // refs.current?.forEach(([element, handler]) => {
      //   element.removeEventListener("scroll", handler);
      // });
    };
  }, []);

  return {
    registerScrollableRef,
  };
}
