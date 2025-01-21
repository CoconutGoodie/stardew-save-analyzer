import {
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { useState } from "react";
import { contextBuilder } from "react-compound-composer";
import { RootProps } from "~frontend/component/Tooltip/Tooltip";

export const { Provider: TooltipProvider, useContext: useTooltip } =
  contextBuilder((props: RootProps) => {
    const { placement = "top" } = props;

    const [open, setOpen] = useState(props.openInitially);

    const data = useFloating({
      placement: placement ?? "top",
      open,
      onOpenChange: setOpen,
      whileElementsMounted: autoUpdate,
      middleware: [
        offset(5),
        flip({
          crossAxis: placement.includes("-"),
          fallbackAxisSideDirection: "start",
          padding: 5,
        }),
        shift({ padding: 5 }),
      ],
    });

    const interactions = useInteractions([
      useHover(data.context, {
        move: false,
      }),

      useFocus(data.context),

      useDismiss(data.context),

      useRole(data.context, { role: "tooltip" }),
    ]);

    return { open, setOpen, ...interactions, ...data };
  });
