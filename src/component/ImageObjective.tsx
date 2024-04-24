import clsx from "clsx";
import { ComponentProps } from "react";

import checkmarkPng from "@src/assets/icon/checkmark.png";

import styles from "./ImageObjective.module.scss";

interface Props extends ComponentProps<"img"> {
  done: boolean;
  noOutline?: boolean;
}

export const ImageObjective = (props: Props) => {
  const { done, noOutline, ...otherProps } = props;
  return (
    <div className={styles.wrapper}>
      <img
        {...otherProps}
        className={clsx(
          props.className,
          styles.objective,
          done && styles.done,
          noOutline && styles.noOutline
        )}
      />
      {done && <img className={styles.checkmark} src={checkmarkPng} />}
    </div>
  );
};
