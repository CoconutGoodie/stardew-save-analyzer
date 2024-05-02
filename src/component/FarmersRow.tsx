import clsx from "clsx";
import { PropsWithChildren } from "react";

import styles from "./FarmersRow.module.scss";

interface Props extends PropsWithChildren {
  className?: string;
}

export const FarmersRow = (props: Props) => {
  return (
    <div className={clsx(styles.row, props.className)}>{props.children}</div>
  );
};
