import { ComponentRef, PropsWithChildren, Ref, forwardRef } from "react";

import clsx from "clsx";
import styles from "./Scrollbox.module.scss";

interface Props extends PropsWithChildren {
  scrollRef?: Ref<HTMLDivElement>;
  expanded?: boolean;
  onExpanded?: (expanded: boolean) => void;
  className?: string;
}

export const Scrollbox = forwardRef<ComponentRef<"div">, Props>(
  (props, ref) => {
    return (
      <div ref={ref} className={clsx(styles.root, props.className)}>
        <button onClick={() => props.onExpanded?.(!props.expanded)}>
          {props.expanded ? "Collapse view" : "Expand view"}
        </button>

        <div
          ref={props.scrollRef}
          className={clsx(styles.wrapper, props.expanded && styles.expanded)}
        >
          {props.children}
        </div>
      </div>
    );
  }
);
