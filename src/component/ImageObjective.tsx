import clsx from "clsx";
import { ComponentProps } from "react";

import checkmarkPng from "@src/assets/icon/checkmark-outlined.png";

import styles from "./ImageObjective.module.scss";

interface Props extends ComponentProps<"img"> {
  done: boolean;
}

export const ImageObjective = (props: Props) => {
  const { done, ...otherProps } = props;
  return (
    <div className={styles.wrapper}>
      <img
        {...otherProps}
        className={clsx(props.className, styles.objective, done && styles.done)}
      />
      {done && <img className={styles.checkmark} src={checkmarkPng} />}
    </div>
  );
};
