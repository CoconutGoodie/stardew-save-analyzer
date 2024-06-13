import clsx from "clsx";
import { PropsWithChildren, ReactNode } from "react";

import checkmarkPng from "@src/assets/icon/checkmark.png";
import questPng from "@src/assets/icon/quest.png";

import styles from "./Objective.module.scss";

interface Props extends PropsWithChildren {
  done?: boolean;
  icon?: ReactNode;
  className?: string;
}

export const Objective = (props: Props) => {
  return (
    <div
      className={clsx(
        styles.container,
        props.className,
        !props.done && styles.incomplete
      )}
    >
      {props.icon ?? (
        <img width={14} src={props.done ? checkmarkPng : questPng} />
      )}
      <span>{props.children}</span>
    </div>
  );
};
