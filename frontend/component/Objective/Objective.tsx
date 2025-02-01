import clsx from "clsx";
import { PropsWithChildren, ReactNode } from "react";
import { ObjectiveSummary } from "~frontend/hook/useGoals";

import checkmarkPng from "~frontend/assets/icon/checkmark.png";
import questPng from "~frontend/assets/icon/quest.png";

import styles from "./Objective.module.scss";

interface Props {
  objective: ObjectiveSummary;
  icon?: ReactNode;
  className?: string;
}

export function Objective(props: Props) {
  const { objective } = props;

  return (
    <div
      className={clsx(
        styles.container,
        props.className,
        !objective.done && styles.incomplete
      )}
    >
      {props.icon ?? (
        <div className={styles.icon}>
          <img width={14} src={objective.done ? checkmarkPng : questPng} />
        </div>
      )}
      <span>
        {objective.description}
        {!objective.done && objective.hint != null && (
          <> — {objective.hint(objective.config as never)}</>
        )}
      </span>
    </div>
  );
}

/** @deprecated */
interface PropsOLD extends PropsWithChildren {
  done?: boolean;
  icon?: ReactNode;
  className?: string;
}

/** @deprecated */
export const ObjectiveOLD = (props: PropsOLD) => {
  return (
    <div
      className={clsx(
        styles.container,
        props.className,
        !props.done && styles.incomplete
      )}
    >
      {props.icon ?? (
        <div className={styles.icon}>
          <img width={14} src={props.done ? checkmarkPng : questPng} />
        </div>
      )}
      <span>{props.children}</span>
    </div>
  );
};
