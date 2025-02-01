import { Children, PropsWithChildren, ReactNode } from "react";
import { Objective } from "~frontend/component/Objective";

import styles from "./SectionPart.module.scss";

export const SectionPart = {
  Statistics(props: PropsWithChildren<{ icon?: ReactNode }>) {
    return (
      <ul className={styles.statistics} data-has-icon={props.icon != null}>
        {Children.map(props.children, (child) => (
          <li>
            {props.icon ? (
              <Objective done icon={props.icon}>
                {child}
              </Objective>
            ) : (
              child
            )}
          </li>
        ))}
      </ul>
    );
  },
};
