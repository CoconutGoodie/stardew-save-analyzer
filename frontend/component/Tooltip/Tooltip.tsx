import { FloatingPortal, Placement, useMergeRefs } from "@floating-ui/react";
import {
  cloneElement,
  ComponentProps,
  forwardRef,
  isValidElement,
  PropsWithChildren,
} from "react";
import { compoundBuilder } from "react-compound-composer";
import { createPortal } from "react-dom";
import {
  TooltipProvider,
  useTooltip,
} from "~frontend/component/Tooltip/Tooltip.context";

import clsx from "clsx";
import styles from "./Tooltip.module.scss";

export interface RootProps extends PropsWithChildren {
  openInitially?: boolean;
  placement?: Placement;
}

export function TooltipContainer() {
  return createPortal(
    <div id="tooltip-content" suppressHydrationWarning={true} />,
    document.body
  );
}

export const Tooltip = compoundBuilder({
  name: "Tooltip",
  provider: TooltipProvider,
  components: {
    Root: (props: RootProps) => {
      return props.children;
    },

    Trigger: forwardRef<HTMLElement, PropsWithChildren>(
      ({ children, ...props }, propRef) => {
        const tooltip = useTooltip();

        const ref = useMergeRefs([tooltip.context.refs.setReference, propRef]);

        if (!isValidElement(children)) {
          throw new Error("Invalid element passed to Tooltip.Trigger");
        }

        return cloneElement(
          children,
          tooltip.getReferenceProps({
            ref,
            ...props,
            ...children.props,
          })
        );
      }
    ),

    Content: forwardRef<HTMLDivElement, ComponentProps<"div">>(
      ({ style, className, ...props }, propRef) => {
        const tooltip = useTooltip();

        const ref = useMergeRefs([tooltip.context.refs.setFloating, propRef]);

        if (!tooltip.open) return;

        return (
          <FloatingPortal id="tooltip-content">
            <div
              ref={ref}
              className={clsx(styles.tooltipContent, className)}
              style={{ ...tooltip.context.floatingStyles, ...style }}
              {...tooltip.getFloatingProps(props)}
            />
          </FloatingPortal>
        );
      }
    ),
  },
});
