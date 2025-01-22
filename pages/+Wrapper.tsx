import { PropsWithChildren } from "react";
import { clientOnly } from "vike-react/clientOnly";

const TooltipContainer = clientOnly(
  async () =>
    (await import("~frontend/component/Tooltip/Tooltip")).TooltipContainer
);

export default function AppWrapper(props: PropsWithChildren) {
  return (
    <>
      {props.children}
      <TooltipContainer />
    </>
  );
}
