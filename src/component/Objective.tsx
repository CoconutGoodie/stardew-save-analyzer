import clsx from "clsx";
import { PropsWithChildren, ReactNode } from "react";

import questPng from "../assets/icon/quest.png";
import checkmarkPng from "../assets/icon/checkmark.png";

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
