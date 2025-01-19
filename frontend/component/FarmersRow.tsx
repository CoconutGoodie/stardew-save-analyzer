import clsx from "clsx";
import { PropsWithChildren, useRef, useState } from "react";
import { useResizeObserver } from "usehooks-ts";

import styles from "./FarmersRow.module.scss";

interface Props extends PropsWithChildren {
  className?: string;
}

export const FarmersRow = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hasScrollbars, setHasScrollbars] = useState(false);

  useResizeObserver({
    ref,
    onResize(size) {
      setHasScrollbars((ref.current?.scrollWidth ?? 0) > (size?.width ?? 0));
    },
  });

  return (
    <div
      ref={ref}
      className={clsx(styles.row, props.className)}
      data-has-scrollbars={hasScrollbars}
    >
      {props.children}
    </div>
  );
};
